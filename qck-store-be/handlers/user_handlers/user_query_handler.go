package user_handlers

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
)

type IUserQueryHandler interface {
	GetAll() ([]UserResponse, int)
	IsEmailAvailable(string) int
	IsUsernameAvailable(string) int
}

type UserQueryHandler struct {
	db *sql.DB
}

func NewUserQueryHandler(db *sql.DB) *UserQueryHandler {
	return &UserQueryHandler{
		db: db,
	}
}

func (h *UserQueryHandler) GetAll() ([]UserResponse, int) {
	var rows *sql.Rows
	query := "SELECT Id, Role, Firstname, Lastname FROM Users"

	if data, err := h.db.Query(query); err == nil {
		rows = data
	} else {
		return []UserResponse{}, http.StatusInternalServerError
	}
	var users = []UserResponse{}

	for rows.Next() {
		var res = *new(UserResponse)

		if err := rows.Scan(&res.Id, &res.Role, &res.FirstName, &res.LastName); err != nil {
			log.Println(err)
			continue
		}
		users = append(users, res)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
	}
	return users, http.StatusOK
}

func (h *UserQueryHandler) IsEmailAvailable(email string) int {
	var res bool
	email = strings.ToLower(email)
	query := "SELECT EXISTS	(SELECT Id FROM Users WHERE Email = $1)"

	if err := h.db.QueryRow(query, email).Scan(&res); err != nil {
		return http.StatusInternalServerError
	}
	if res {
		return http.StatusOK
	} else {
		return http.StatusNotFound
	}
}

func (h *UserQueryHandler) IsUsernameAvailable(name string) int {
	var res bool
	name = strings.ToLower(name)
	query := "SELECT EXISTS (SELECT Id FROM Users WHERE Username = $1)"

	if err := h.db.QueryRow(query, name).Scan(&res); err != nil {
		return http.StatusInternalServerError
	}
	if res {
		return http.StatusOK
	} else {
		return http.StatusNotFound
	}
}
