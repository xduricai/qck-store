package user_handlers

import (
	"database/sql"
	"encoding/hex"
	"net/http"
	"strings"

	"golang.org/x/crypto/sha3"
)

type IUSerCommandHandler interface {
	Login(*LoginCommand) (UserResponse, int)
}

type UserCommandHandler struct {
	db *sql.DB
}

func NewUserCommandHandler(db *sql.DB) *UserCommandHandler {
	return &UserCommandHandler{
		db: db,
	}
}

func (h *UserCommandHandler) Login(command *LoginCommand) (UserResponse, int) {
	var res UserResponse
	var password string
	query := "SELECT id, role, firstname, lastname, password FROM users WHERE email = $1 OR username = $2"

	if err := h.db.
		QueryRow(query, strings.ToLower(command.Email), strings.ToLower(command.Username)).
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
