package file_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IFileCommandHandler interface {
	UploadFile(fileName, folderId, userId string) (int, int)
	DeleteFile(fileId, userId string) int
}

type FileCommandHandler struct {
	db *sql.DB
}

func NewFileCommandHandler(db *sql.DB) *FileCommandHandler {
	return &FileCommandHandler{
		db: db,
	}
}

func (h *FileCommandHandler) UploadFile(fileName string, folderId string, userId string) (int, int) {
	var folderPath string
	query := "SELECT Path FROM Directories WHERE Id = $1 AND UserId = $2"

	if err := h.db.QueryRow(query, folderId, userId).
		Scan(&folderPath); err != nil || len(folderPath) == 0 {
		log.Println(err)
		return -1, http.StatusNotFound
	}

	// TODO finish
	// query = "INSERT INTO Files (UserId, ParentId, Name, LastModified, Created, Path) VALUES (4, 24, 'Nested Folder 1', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '24/' || currval('directories_id_seq'::regclass) || '/');"

	return 1, http.StatusOK
}

func (h *FileCommandHandler) DeleteFile(fileId, userId string) int {
	return http.StatusOK
}
