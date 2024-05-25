package file_handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type IFileQueryHandler interface {
	GetFileName(fileId, userId string) string
	GetForDirectory(folderId, userId string) ([]handlers.FileResponse, int)
	GetByName(searchTerm, userId string) ([]handlers.FileResponse, int)
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
		log.Println("Could not retrieve file name", err)
		return ""
	}
	return res
}

func (h *FileQueryHandler) GetForDirectory(folderId, userId string) ([]handlers.FileResponse, int) {
	var res []handlers.FileResponse
	var rows *sql.Rows

	query := "SELECT Id, Name, Size, LastModified, Created FROM Files WHERE UserId = $1 AND DirectoryId = $2"
	if data, err := h.db.Query(query, userId, folderId); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while attempting to retrieve files", err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var file handlers.FileResponse

		if err := rows.Scan(&file.Id, &file.Name, &file.Size, &file.Modified, &file.Created); err != nil {
			log.Println("An error occurred while parsing a file", err)
			continue
		}
		file.FormatDates()
		res = append(res, file)
	}
	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
	}

	return res, http.StatusOK
}

func (h *FileQueryHandler) GetByName(searchTerm, userId string) ([]handlers.FileResponse, int) {
	var res []handlers.FileResponse
	var rows *sql.Rows
	searchTerm = fmt.Sprint("%", searchTerm, "%")

	query := "SELECT Id, Name, Size, LastModified, Created FROM Files WHERE UserId = $1 AND LOWER(Name) LIKE $2"
	if data, err := h.db.Query(query, userId, searchTerm); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while attempting to retrieve files", err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var file handlers.FileResponse

		if err := rows.Scan(&file.Id, &file.Name, &file.Size, &file.Modified, &file.Created); err != nil {
			log.Println("An error occurred while parsing a file", err)
			continue
		}
		file.FormatDates()
		res = append(res, file)
	}
	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
	}

	return res, http.StatusOK
}
