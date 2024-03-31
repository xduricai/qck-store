package directory_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IDirectoryCommandHandler interface {
	GetFolderContentForUser(string, string) (DirectoryContentResponse, int)
}

type DirectoryCommandHandler struct {
	db *sql.DB
}

func NewDirectoryCommandHandler(db *sql.DB) *DirectoryCommandHandler {
	return &DirectoryCommandHandler{
		db: db,
	}
}

func (h *DirectoryCommandHandler) GetFolderContentForUser(id, folderId string) (DirectoryContentResponse, int) {
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
		res.Files = append(res.Files, file)
	}

	query = "SELECT Id, Name FROM Directories WHERE UserId = $1 AND ParentId = $2"
	if data, err := h.db.Query(query, id, folderId); err == nil {
		rows = data
	} else {
		log.Println(err)
		return res, http.StatusInternalServerError
	}

	for rows.Next() {
		var dir DirectoryResponse

		if err := rows.Scan(&dir.Id, &dir.Name); err != nil {
			log.Println(err)
			continue
		}
		res.Directories = append(res.Directories, dir)
	}

	return res, http.StatusOK
}
