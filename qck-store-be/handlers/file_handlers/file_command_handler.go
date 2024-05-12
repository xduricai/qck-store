package file_handlers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
	dirh "github.com/xduricai/qck-store/qck-store-be/handlers/directory_handlers"
)

type IFileCommandHandler interface {
	UploadFile(fileName, folderId, userId string, size int64) (dirh.FileResponse, int)
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

func (h *FileCommandHandler) UploadFile(fileName, folderId, userId string, size int64) (dirh.FileResponse, int) {
	var file dirh.FileResponse
	var folderPath string

	currentTime := handlers.GetUTCTime()
	formattedTime, _ := handlers.FormatDate(currentTime)
	file.Created = formattedTime
	file.Modified = formattedTime
	file.Size = int(size)

	query := "SELECT Path FROM Directories WHERE Id = $1 AND UserId = $2"
	if err := h.db.QueryRow(query, folderId, userId).
		Scan(&folderPath); err != nil || len(folderPath) == 0 {
		log.Println("Could not retrieve specified directory to upload file to", err)
		return file, http.StatusNotFound
	}

	query = "INSERT INTO Files (UserId, DirectoryId, Name, Path, LastModified, Created, Size) VALUES ($1, $2, $3, $4, $5, $5, $6) RETURNING Id, Name"
	if err := h.db.QueryRow(query, userId, folderId, fileName, folderPath, currentTime, size).
		Scan(&file.Id, &file.Name); err != nil {
		log.Println("An error occurred during file upload", err)
		return file, http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed + $1 WHERE Id = $2;"
	if err := h.db.QueryRow(query, size, userId); err != nil {
		log.Println("An error occurred while adjusting total number of bytes used for user")
	}

	return file, http.StatusOK
}

func (h *FileCommandHandler) DeleteFile(fileId, userId string) int {
	var size int

	query := "DELETE FROM Files WHERE Id = $1 AND UserId = $2 RETURNING Size"
	if err := h.db.QueryRow(query, fileId, userId).Scan(&size); err != nil {
		log.Println("Failed while attempting to delete file", err)
		return http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed - $1 WHERE Id = $2;"
	if err := h.db.QueryRow(query, size, userId); err != nil {
		log.Println("An error occurred while adjusting total number of bytes used for user")
	}

	return http.StatusOK
}
