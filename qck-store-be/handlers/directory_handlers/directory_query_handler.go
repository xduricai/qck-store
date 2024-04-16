package directory_handlers

import (
	"database/sql"
	"log"
	"net/http"
)

type IDirectoryQueryHandler interface {
	GetAllForUser(string) ([]DirectoryResponse, int)
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
	query := "SELECT Id, Name, CASE WHEN ParentId IS NULL THEN 1 ELSE 0 END AS IsRoot FROM Directories WHERE UserId = $1"

	if data, err := h.db.Query(query, id); err == nil {
		rows = data
	} else {
		log.Println(err)
		return []DirectoryResponse{}, http.StatusInternalServerError
	}
	directories := []DirectoryResponse{}

	for rows.Next() {
		var res = *new(DirectoryResponse)

		if err := rows.Scan(&res.Id, &res.Name, &res.IsRoot); err != nil {
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
