package directory_handlers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type IDirectoryCommandHandler interface {
	CreateDirectory(folderName, parentId, userId string) (handlers.DirectoryResponse, int)
	RenameDirectory(folderName, folderId, userId string) int
	DeleteDirectory(folderId, userId string) int
}

type DirectoryCommandHandler struct {
	db *sql.DB
}

func NewDirectoryCommandHandler(db *sql.DB) *DirectoryCommandHandler {
	return &DirectoryCommandHandler{
		db: db,
	}
}

func (h *DirectoryCommandHandler) CreateDirectory(folderName, parentId, userId string) (handlers.DirectoryResponse, int) {
	var folder handlers.DirectoryResponse
	var folderPath string

	currentTime := handlers.GetUTCTime()
	formattedTime, _ := handlers.FormatDate(currentTime)
	folder.Created = formattedTime
	folder.Modified = formattedTime

	query := "SELECT Path FROM Directories WHERE Id = $1 AND UserId = $2"
	if err := h.db.QueryRow(query, parentId, userId).
		Scan(&folderPath); err != nil || len(folderPath) == 0 {
		log.Println("Could not retrieve specified directory to upload folder to", err)
		return folder, http.StatusNotFound
	}

	query = "INSERT INTO Directories (UserId, ParentId, Name, Path, LastModified, Created) VALUES ($1, $2, $3, $4, $5, $5) RETURNING Id, Name"
	if err := h.db.QueryRow(query, userId, parentId, folderName, folderPath, currentTime).
		Scan(&folder.Id, &folder.Name); err != nil {
		log.Println("An error occurred during folder creation", err)
		return folder, http.StatusInternalServerError
	}

	return folder, http.StatusOK
}

func (h *DirectoryCommandHandler) RenameDirectory(folderName, folderId, userId string) int {
	query := "UPDATE Directories SET Name = $1, LastModified = $2 WHERE Id = $3 AND UserId = $4"
	currentTime := handlers.GetUTCTime()

	if err := h.db.QueryRow(query, folderName, currentTime, folderId, userId).Scan(); err != nil && err != sql.ErrNoRows {
		log.Println("An error occurred while renaming folder", err)
		return http.StatusInternalServerError
	}
	return http.StatusOK
}

func (h *DirectoryCommandHandler) DeleteDirectory(folderId, userId string) int {
	return http.StatusOK
}
