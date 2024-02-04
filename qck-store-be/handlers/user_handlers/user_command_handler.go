package user_handlers

import (
	"database/sql"
	"encoding/hex"
	"net/http"
	"strings"
	"time"

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
		return res, http.StatusInternalServerError
	}
	if res.EmailInUse || res.NameInUse {
		return res, http.StatusBadRequest
	}

	password := generatePasswordHash(&command.Password)
	created := time.Now().Format("2006-01-02 15:04:05")
	query = `
		INSERT INTO Users (Role, UserName, Email, FirstName, LastName, Password, Created, TotalBytesUsed, Quota)
		VALUES ('User', $1, $2, $3, $4, $5, $6, 0, 1000000000) RETURNING Id`

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
		return res, http.StatusInternalServerError
	}
	return res, http.StatusOK
}

func (h *UserCommandHandler) Login(command *LoginCommand) (UserResponse, int) {
	var res UserResponse
	var password string
	command.Email = strings.ToLower(command.Email)
	command.Username = strings.ToLower(command.Username)
	query := "SELECT Id, Role, Firstname, Lastname, Password FROM Users WHERE Email = $1 OR Username = $2"

	if err := h.db.
		QueryRow(query, command.Email, command.Username).
		Scan(
			&res.Id,
			&res.Role,
			&res.FirstName,
			&res.LastName,
			&password,
		); err != nil {
		return res, http.StatusNotFound
	}

	if hash := generatePasswordHash(&command.Password); hash != password {
		return res, http.StatusUnauthorized
	}
	return res, http.StatusOK
}

func generatePasswordHash(password *string) string {
	pw := []byte(*password)
	hash := make([]byte, 64)
	sha3.ShakeSum256(hash, pw)
	return hex.EncodeToString(hash)
}
