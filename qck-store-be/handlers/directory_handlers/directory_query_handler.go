package directory_handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type IDirectoryQueryHandler interface {
	GetAll(userId string) ([]handlers.DirectoryResponse, int)
	GetForDirectory(folderId, userId string) ([]handlers.DirectoryResponse, int)
	GetByName(folderId, userId string) ([]handlers.DirectoryResponse, int)
}

type DirectoryQueryHandler struct {
	db *sql.DB
}

func NewDirectoryQueryHandler(db *sql.DB) *DirectoryQueryHandler {
	return &DirectoryQueryHandler{
		db: db,
	}
}

func (h *DirectoryQueryHandler) GetAll(id string) ([]handlers.DirectoryResponse, int) {
	var rows *sql.Rows
	query := "SELECT Id, Name, Path, LastModified, Created, CASE WHEN ParentId IS NULL THEN 1 ELSE 0 END AS IsRoot FROM Directories WHERE UserId = $1"

	if data, err := h.db.Query(query, id); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while attempting to retrieve directories", err)
		return []handlers.DirectoryResponse{}, http.StatusInternalServerError
	}
	directories := []handlers.DirectoryResponse{}

	for rows.Next() {
		var res handlers.DirectoryResponse

		if err := rows.Scan(&res.Id, &res.Name, &res.Path, &res.Modified, &res.Created, &res.IsRoot); err != nil {
			log.Println("An error occurred while parsing a directory", err)
			continue
		}
		res.FormatDates()
		directories = append(directories, res)
	}

	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
	}
	return directories, http.StatusOK
}

func (h *DirectoryQueryHandler) GetForDirectory(folderId, userId string) ([]handlers.DirectoryResponse, int) {
	var res []handlers.DirectoryResponse
	var rows *sql.Rows

	query := "SELECT Id, Name, Path, LastModified, Created FROM Directories WHERE UserId = $1 AND ParentId = $2"
	if data, err := h.db.Query(query, userId, folderId); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while attempting to retrieve directories", err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var dir handlers.DirectoryResponse

		if err := rows.Scan(&dir.Id, &dir.Name, &dir.Path, &dir.Modified, &dir.Created); err != nil {
			log.Println("An error occurred while parsing a directory", err)
			continue
		}
		dir.FormatDates()
		res = append(res, dir)
	}
	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
	}

	return res, http.StatusOK
}

func (h *DirectoryQueryHandler) GetByName(searchTerm, userId string) ([]handlers.DirectoryResponse, int) {
	var res []handlers.DirectoryResponse
	var rows *sql.Rows
	searchTerm = fmt.Sprint("%", searchTerm, "%")

	query := "SELECT Id, Name, Path, LastModified, Created FROM Directories WHERE UserId = $1 AND LOWER(Name) LIKE	$2"
	if data, err := h.db.Query(query, userId, searchTerm); err == nil {
		rows = data
	} else {
		log.Println("An error occurred while attempting to retrieve directories", err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var dir handlers.DirectoryResponse

		if err := rows.Scan(&dir.Id, &dir.Name, &dir.Path, &dir.Modified, &dir.Created); err != nil {
			log.Println("An error occurred while parsing a directory", err)
			continue
		}
		dir.FormatDates()
		res = append(res, dir)
	}
	if err := rows.Err(); err != nil {
		log.Println("An unknown error occurred", err)
	}

	return res, http.StatusOK
}
