package user_handlers

import (
	"database/sql"
	"encoding/hex"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/xduricai/qck-store/qck-store-be/handlers"
	"golang.org/x/crypto/sha3"
)

type IUserCommandHandler interface {
	Login(*LoginCommand) (UserResponse, int)
	Register(*RegistrationCommand) (RegistrationResponse, int)
	Update(command *UpdateUserCommand, id string, ctx *gin.Context, tx *sql.Tx) (string, int)
	ChangePassword(command *UpdatePasswordCommand, id string) int
}

type UserCommandHandler struct {
	db *sql.DB
}

func NewUserCommandHandler(db *sql.DB) *UserCommandHandler {
	return &UserCommandHandler{
		db: db,
	}
}

func generatePasswordHash(password *string) string {
	pw := []byte(*password)
	hash := make([]byte, 64)
	sha3.ShakeSum256(hash, pw)
	return hex.EncodeToString(hash)
}

func (h *UserCommandHandler) Register(command *RegistrationCommand) (RegistrationResponse, int) {
	res := RegistrationResponse{
		Id: -1,
	}
	command.Email = strings.ToLower(command.Email)
	command.Username = strings.ToLower(command.Username)

	if command.Email == "" ||
		command.Username == "" ||
		command.FirstName == "" ||
		command.LastName == "" ||
		command.Password == "" {
		return res, http.StatusBadRequest
	}

	query := `SELECT
		EXISTS (SELECT 1 FROM Users WHERE Email = $1),
		EXISTS (SELECT 1 FROM Users WHERE Username = $2)`

	if err := h.db.
		QueryRow(query, command.Email, command.Username).
		Scan(&res.EmailInUse, &res.NameInUse); err != nil {
		log.Println(err)
		return res, http.StatusInternalServerError
	}
	if res.EmailInUse || res.NameInUse {
		return res, http.StatusBadRequest
	}

	password := generatePasswordHash(&command.Password)
	created := handlers.GetUTCTime()
	query = `
		INSERT INTO Users (Role, UserName, Email, FirstName, LastName, Password, Created, TotalBytesUsed, Quota)
		VALUES ('user', $1, $2, $3, $4, $5, $6, 0, 1073741824) RETURNING Id`

	if err := h.db.
		QueryRow(
			query,
			command.Username,
			command.Email,
			command.FirstName,
			command.LastName,
			password,
			created,
		).Scan(&res.Id); err != nil {
		log.Println(err)
		return res, http.StatusInternalServerError
	}
	return res, http.StatusOK
}

func (h *UserCommandHandler) Login(command *LoginCommand) (UserResponse, int) {
	var res UserResponse
	var password string
	var bytesUsed sql.NullInt32
	var bytesTotal sql.NullInt32
	var profilePicture []byte
	command.Identifier = strings.ToLower(command.Identifier)
	query := "SELECT Id, Role, Firstname, Lastname, Email, TotalBytesUsed, Quota, Password, ProfilePicture FROM Users WHERE Email = $1 OR Username = $1"

	if err := h.db.
		QueryRow(query, command.Identifier).
		Scan(
			&res.Id,
			&res.Role,
			&res.FirstName,
			&res.LastName,
			&res.Email,
			&bytesUsed,
			&bytesTotal,
			&password,
			&profilePicture,
		); err != nil {
		log.Println(err)
		return res, http.StatusNotFound
	}

	if hash := generatePasswordHash(&command.Password); hash != password {
		return res, http.StatusUnauthorized
	}

	if bytesUsed.Valid {
		res.BytesUsed = int(bytesUsed.Int32)
	}
	if bytesTotal.Valid {
		res.BytesTotal = int(bytesTotal.Int32)
	}
	res.Email = FormatEmail(res.Email)
	res.ProfilePicture = string(profilePicture)
	return res, http.StatusOK
}

func (h *UserCommandHandler) Update(command *UpdateUserCommand, id string, ctx *gin.Context, tx *sql.Tx) (string, int) {
	var query string

	command.Email = strings.ToLower(command.Email)

	if (command.Email == "" && command.UpdateEmail) ||
		command.FirstName == "" ||
		command.LastName == "" {
		return "", http.StatusBadRequest
	}

	if command.UpdateEmail {
		var emailInUse bool

		query = "SELECT EXISTS (SELECT 1 FROM Users WHERE Email = $1 AND Id != $2)"
		if err := tx.QueryRowContext(ctx, query, command.Email, id).Scan(&emailInUse); err != nil {
			log.Println("Could not check for email conflicts", err)
			return "", http.StatusInternalServerError
		}
		if emailInUse {
			return "", http.StatusConflict
		}

		query = "UPDATE Users SET Email = $1 WHERE Id = $2"
		if _, err := tx.ExecContext(ctx, query, command.Email, id); err != nil {
			log.Println("This email is already in use", err)
			return "", http.StatusInternalServerError
		}
	}

	if command.UpdatePicture {
		data := []byte(command.ProfilePicture)
		query = "UPDATE Users SET ProfilePicture = $1 WHERE Id = $2"
		if _, err := tx.ExecContext(ctx, query, data, id); err != nil {
			log.Println("An error occurred while saving profile picture", err)
			return "", http.StatusInternalServerError
		}
	}

	query = "UPDATE Users SET FirstName = $1, LastName = $2 WHERE Id = $3"
	if _, err := tx.ExecContext(ctx, query, command.FirstName, command.LastName, id); err != nil {
		log.Println("An error occurred while updating name", err)
		return "", http.StatusInternalServerError
	}

	return FormatEmail(command.Email), http.StatusOK
}

func (h *UserCommandHandler) ChangePassword(command *UpdatePasswordCommand, id string) int {
	if command.NewPassword == "" {
		return http.StatusBadRequest
	}

	oldPassword := generatePasswordHash(&command.OldPassword)
	newPassword := generatePasswordHash(&command.NewPassword)

	var correctPw bool
	query := "SELECT EXISTS (SELECT 1 FROM Users WHERE Password = $1 AND Id = $2)"
	if err := h.db.QueryRow(query, oldPassword, id).Scan(&correctPw); err != nil {
		log.Println("Could not verify password", err)
		return http.StatusInternalServerError
	}
	if !correctPw {
		return http.StatusUnauthorized
	}

	query = "UPDATE Users SET Password = $1 WHERE Id = $2"
	if _, err := h.db.Exec(query, newPassword, id); err != nil {
		log.Println("Could not update password", err)
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
