package user_handlers

import (
	"database/sql"
	"encoding/hex"
	"log"
	"net/http"
	"strings"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
	"golang.org/x/crypto/sha3"
)

type IUSerCommandHandler interface {
	Login(*LoginCommand) (UserResponse, int)
	Register(*RegistrationCommand) (RegistrationResponse, int)
}

type UserCommandHandler struct {
	db *sql.DB
}

func NewUserCommandHandler(db *sql.DB) *UserCommandHandler {
	return &UserCommandHandler{
		db: db,
	}
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
	command.Identifier = strings.ToLower(command.Identifier)
	query := "SELECT Id, Role, Firstname, Lastname, Email, TotalBytesUsed, Quota, Password FROM Users WHERE Email = $1 OR Username = $1"

	if err := h.db.
		QueryRow(query, command.Identifier).
		Scan(
			&res.Id,
			&res.Role,
			&res.FirstName,
			&res.LastName,
			&res.Email,
			&res.BytesUsed,
			&res.BytesTotal,
			&password,
		); err != nil {
		log.Println(err)
		return res, http.StatusNotFound
	}

	if hash := generatePasswordHash(&command.Password); hash != password {
		return res, http.StatusUnauthorized
	}
	res.FormatEmail()
	return res, http.StatusOK
}

func generatePasswordHash(password *string) string {
	pw := []byte(*password)
	hash := make([]byte, 64)
	sha3.ShakeSum256(hash, pw)
	return hex.EncodeToString(hash)
}
