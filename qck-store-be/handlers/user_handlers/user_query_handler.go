package user_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

// test file, TODO remove later

type IUserQueryHandler interface {
	GetAll() ([]UserResponse, int)
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
		log.Println(err)
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
