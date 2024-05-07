package directory_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IDirectoryQueryHandler interface {
	GetAllForUser(string) ([]DirectoryResponse, int)
	GetFolderContentForUser(string, string) (DirectoryContentResponse, int)
}

type DirectoryQueryHandler struct {
	db *sql.DB
}

func NewDirectoryQueryHandler(db *sql.DB) *DirectoryQueryHandler {
	return &DirectoryQueryHandler{
		db: db,
	}
}

func (h *DirectoryQueryHandler) GetAllForUser(id string) ([]DirectoryResponse, int) {
	var rows *sql.Rows
	query := "SELECT Id, Name, LastModified, Created, CASE WHEN ParentId IS NULL THEN 1 ELSE 0 END AS IsRoot FROM Directories WHERE UserId = $1"

	if data, err := h.db.Query(query, id); err == nil {
		rows = data
	} else {
		log.Println(err)
		return []DirectoryResponse{}, http.StatusInternalServerError
	}
	directories := []DirectoryResponse{}

	for rows.Next() {
		var res = *new(DirectoryResponse)

		if err := rows.Scan(&res.Id, &res.Name, &res.Modified, &res.Created, &res.IsRoot); err != nil {
			log.Println(err)
			continue
		}
		res.FormatDates()
		directories = append(directories, res)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
	}
	return directories, http.StatusOK
}

func (h *DirectoryQueryHandler) GetFolderContentForUser(id, folderId string) (DirectoryContentResponse, int) {
	var res DirectoryContentResponse

	var rows *sql.Rows

	query := "SELECT Id, Name, Size, LastModified, Created FROM Files WHERE UserId = $1 AND DirectoryId = $2"
	if data, err := h.db.Query(query, id, folderId); err == nil {
		rows = data
	} else {
		log.Println(err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var file FileResponse

		if err := rows.Scan(&file.Id, &file.Name, &file.Size, &file.Modified, &file.Created); err != nil {
			log.Println(err)
			continue
		}
		file.FormatDates()
		res.Files = append(res.Files, file)
	}

	query = "SELECT Id, Name, LastModified, Created FROM Directories WHERE UserId = $1 AND ParentId = $2"
	if data, err := h.db.Query(query, id, folderId); err == nil {
		rows = data
	} else {
		log.Println(err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var dir DirectoryResponse

		if err := rows.Scan(&dir.Id, &dir.Name, &dir.Modified, &dir.Created); err != nil {
			log.Println(err)
			continue
		}
		dir.FormatDates()
		res.Directories = append(res.Directories, dir)
	}

	return res, http.StatusOK
}
