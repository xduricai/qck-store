package file_handlers

import (
	"database/sql"
	"log"
)

type IFileQueryHandler interface {
	GetFileName(fileId, userId string) string
}

type FileQueryHandler struct {
	db *sql.DB
}

func NewFileQueryHandler(db *sql.DB) *FileQueryHandler {
	return &FileQueryHandler{
		db: db,
	}
}

func (h *FileQueryHandler) GetFileName(fileId, userId string) string {
	var res string
	query := "SELECT Name FROM Files WHERE Id = $1 AND UserId = $2"

	if err := h.db.QueryRow(query, fileId, userId).
		Scan(&res); err != nil {
		log.Println(err)
		return ""
	}
	return res
}
