package directory_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IDirectoryQueryHandler interface {
	GetRootForUser(string) ([]DirectoryResponse, int)
}

type DirectoryQueryHandler struct {
	db *sql.DB
}

func NewDirectoryQueryHandler(db *sql.DB) *DirectoryQueryHandler {
	return &DirectoryQueryHandler{
		db: db,
	}
}

func (h *DirectoryQueryHandler) GetRootForUser(id string) ([]DirectoryResponse, int) {
	var rows *sql.Rows
	query := "SELECT Id, Name FROM Directories WHERE UserId = $1 AND ParentId IS NULL"

	if data, err := h.db.Query(query, id); err == nil {
		rows = data
	} else {
		log.Println(err)
		return []DirectoryResponse{}, http.StatusInternalServerError
	}
	directories := []DirectoryResponse{}

	for rows.Next() {
		var res = *new(DirectoryResponse)

		if err := rows.Scan(&res.Id, &res.Name); err != nil {
			log.Println(err)
			continue
		}
		directories = append(directories, res)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
	}
	return directories, http.StatusOK
}
