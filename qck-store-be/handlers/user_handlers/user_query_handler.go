package user_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IUserQueryHandler interface {
	GetAll() ([]UserResponse, int)
	GetUserDetails(string) (UserResponse, int)
	FileFits(fileSize int64, userId string) bool
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
	query := "SELECT Id, Role, Firstname, Lastname, TotalBytesUsed, Quota FROM Users"

	if data, err := h.db.Query(query); err == nil {
		rows = data
	} else {
		log.Println(err)
		return []UserResponse{}, http.StatusInternalServerError
	}
	var users = []UserResponse{}

	for rows.Next() {
		var res UserResponse

		if err := rows.Scan(
			&res.Id,
			&res.Role,
			&res.FirstName,
			&res.LastName,
			&res.BytesUsed,
			&res.BytesTotal,
		); err != nil {
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

func (h *UserQueryHandler) GetUserDetails(id string) (UserResponse, int) {
	var res UserResponse
	query := "SELECT Id, Role, Firstname, Lastname, TotalBytesUsed, Quota FROM Users WHERE Id = $1"

	if err := h.db.QueryRow(query, id).
		Scan(
			&res.Id,
			&res.Role,
			&res.FirstName,
			&res.LastName,
			&res.BytesUsed,
			&res.BytesTotal,
		); err != nil {
		log.Println("An error occurred while retrieving user information", err)
		return res, http.StatusInternalServerError
	}
	return res, http.StatusOK
}

func (h *UserQueryHandler) FileFits(fileSize int64, userId string) bool {
	var spaceRemaining int64
	query := "SELECT Quota - TotalBytesUsed FROM Users WHERE Id = $1"

	if err := h.db.QueryRow(query, userId).Scan(&spaceRemaining); err != nil {
		log.Println("An error occurred while retrieving available space", err)
		return false
	}
	return fileSize <= spaceRemaining
}
