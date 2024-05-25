package file_handlers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type IFileCommandHandler interface {
	UploadFile(fileName, folderId, userId string, size int64) (handlers.FileResponse, int)
	RenameFile(fileName, fileId, userId string) int
	MoveFile(folderId, fileId, userId string) int
	DeleteFile(fileId, userId string) (int, int)
}

type FileCommandHandler struct {
	db *sql.DB
}

func NewFileCommandHandler(db *sql.DB) *FileCommandHandler {
	return &FileCommandHandler{
		db: db,
	}
}

func (h *FileCommandHandler) UploadFile(fileName, folderId, userId string, size int64) (handlers.FileResponse, int) {
	var file handlers.FileResponse
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
	if err := h.db.QueryRow(query, size, userId).Scan(); err != nil && err != sql.ErrNoRows {
		log.Println("An error occurred while adjusting total number of bytes used for user", err)
	}

	return file, http.StatusOK
}

func (h *FileCommandHandler) RenameFile(fileName, fileId, userId string) int {
	query := "UPDATE Files SET Name = $1, LastModified = $2 WHERE Id = $3 AND UserId = $4"
	currentTime := handlers.GetUTCTime()

	if err := h.db.QueryRow(query, fileName, currentTime, fileId, userId).Scan(); err != nil && err != sql.ErrNoRows {
		log.Println("An error occurred while renaming file", err)
		return http.StatusInternalServerError
	}
	return http.StatusOK
}

func (h *FileCommandHandler) MoveFile(folderId, fileId, userId string) int {
	query := "SELECT Path FROM Directories WHERE Id = $1"
	var newPath string

	if err := h.db.QueryRow(query, folderId).Scan(&newPath); err != nil {
		log.Println("Could not retrieve the destination folder when attempting to move file", err)
		return http.StatusNotFound
	}

	query = "UPDATE Files SET DirectoryId = $1, Path = $2, LastModified = $3 WHERE Id = $4 AND UserId = $5"
	currentTime := handlers.GetUTCTime()

	if err := h.db.QueryRow(query, folderId, newPath, currentTime, fileId, userId).
		Scan(); err != nil && err != sql.ErrNoRows {
		log.Println("An error occurred while moving file", err)
		return http.StatusInternalServerError
	}
	return http.StatusOK
}

func (h *FileCommandHandler) DeleteFile(fileId, userId string) (int, int) {
	var size int

	query := "DELETE FROM Files WHERE Id = $1 AND UserId = $2 RETURNING Size"
	if err := h.db.QueryRow(query, fileId, userId).Scan(&size); err != nil {
		log.Println("Failed while attempting to delete file", err.Error())
		return size, http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed - $1 WHERE Id = $2"
	if err := h.db.QueryRow(query, size, userId).Scan(); err != nil && err != sql.ErrNoRows {
		log.Println("An error occurred while adjusting total number of bytes used for user", err)
	}

	return size, http.StatusOK
}
