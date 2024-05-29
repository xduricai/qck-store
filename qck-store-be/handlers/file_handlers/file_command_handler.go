package file_handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type IFileCommandHandler interface {
	UploadFile(fileName, folderId, userId string, size int64, ctx *gin.Context, tx *sql.Tx) (handlers.FileResponse, int)
	RenameFile(fileName, fileId, userId string) int
	MoveFile(folderId, fileId, userId string) int
	DeleteFile(fileId, userId string, ctx *gin.Context, tx *sql.Tx) (int, int)
	DeleteDirectoryChildren(folderId, userId string, ctx *gin.Context, tx *sql.Tx) ([]int, int, int)
}

type FileCommandHandler struct {
	db *sql.DB
}

func NewFileCommandHandler(db *sql.DB) *FileCommandHandler {
	return &FileCommandHandler{
		db: db,
	}
}

func (h *FileCommandHandler) UploadFile(fileName, folderId, userId string, size int64, ctx *gin.Context, tx *sql.Tx) (handlers.FileResponse, int) {
	var file handlers.FileResponse
	var folderPath string

	currentTime := handlers.GetUTCTime()
	formattedTime, _ := handlers.FormatDate(currentTime)
	file.Created = formattedTime
	file.Modified = formattedTime
	file.Size = int(size)

	query := "SELECT Path FROM Directories WHERE Id = $1 AND UserId = $2"
	if err := tx.QueryRowContext(ctx, query, folderId, userId).
		Scan(&folderPath); err != nil || len(folderPath) == 0 {
		log.Println("Could not retrieve specified directory to upload file to", err)
		return file, http.StatusNotFound
	}

	query = "INSERT INTO Files (UserId, DirectoryId, Name, Path, LastModified, Created, Size) VALUES ($1, $2, $3, $4, $5, $5, $6) RETURNING Id, Name"
	if err := tx.QueryRowContext(ctx, query, userId, folderId, fileName, folderPath, currentTime, size).
		Scan(&file.Id, &file.Name); err != nil {
		log.Println("An error occurred during file upload", err)
		return file, http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed + $1 WHERE Id = $2;"
	if _, err := tx.ExecContext(ctx, query, size, userId); err != nil {
		log.Println("An error occurred while adjusting total number of bytes used for user", err)
		return file, http.StatusInternalServerError
	}

	return file, http.StatusOK
}

func (h *FileCommandHandler) RenameFile(fileName, fileId, userId string) int {
	query := "UPDATE Files SET Name = $1, LastModified = $2 WHERE Id = $3 AND UserId = $4"
	currentTime := handlers.GetUTCTime()

	if _, err := h.db.Exec(query, fileName, currentTime, fileId, userId); err != nil {
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

	if _, err := h.db.Exec(query, folderId, newPath, currentTime, fileId, userId); err != nil {
		log.Println("An error occurred while moving file", err)
		return http.StatusInternalServerError
	}
	return http.StatusOK
}

func (h *FileCommandHandler) DeleteFile(fileId, userId string, ctx *gin.Context, tx *sql.Tx) (int, int) {
	var size int

	query := "DELETE FROM Files WHERE Id = $1 AND UserId = $2 RETURNING Size"
	if err := tx.QueryRowContext(ctx, query, fileId, userId).Scan(&size); err != nil {
		log.Println("Failed while attempting to delete file", err.Error())
		return size, http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed - $1 WHERE Id = $2"
	if _, err := tx.ExecContext(ctx, query, size, userId); err != nil {
		log.Println("An error occurred while adjusting total number of bytes used for user", err)
		return size, http.StatusInternalServerError
	}

	return size, http.StatusOK
}

func (h *FileCommandHandler) DeleteDirectoryChildren(folderId, userId string, ctx *gin.Context, tx *sql.Tx) ([]int, int, int) {
	var rows *sql.Rows
	var path string
	var totalSize int
	ids := []int{}

	query := "SELECT Path FROM Directories WHERE Id = $1 AND UserId = $2"
	if err := tx.QueryRowContext(ctx, query, folderId, userId).Scan(&path); err != nil {
		log.Println("Could not retrieve directory for deletion", err)
		return ids, totalSize, http.StatusNotFound
	}
	path = fmt.Sprint(path, "%")

	query = "DELETE FROM Files WHERE UserId = $1 AND Path LIKE $2 RETURNING Id, Size"
	if data, err := tx.QueryContext(ctx, query, userId, path); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while deleting file descendants of folder", err)
		return ids, totalSize, http.StatusInternalServerError
	}

	for rows.Next() {
		var id int
		var size int

		if err := rows.Scan(&id, &size); err != nil {
			log.Println("An error occurred while parsing deleted row", err)
			return ids, totalSize, http.StatusInternalServerError
		}
		ids = append(ids, id)
		totalSize += size
	}
	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
		return ids, totalSize, http.StatusInternalServerError
	}
	if err := rows.Close(); err != nil {
		log.Println("An error occurred while closing rows", err)
		return ids, totalSize, http.StatusInternalServerError
	}

	query = "UPDATE Users SET TotalBytesUsed = TotalBytesUsed - $1 WHERE Id = $2"
	if _, err := tx.ExecContext(ctx, query, totalSize, userId); err != nil {
		log.Println("An error occurred while adjusting total number of bytes used for user", err)
		return ids, totalSize, http.StatusInternalServerError
	}

	return ids, totalSize, http.StatusOK
}
