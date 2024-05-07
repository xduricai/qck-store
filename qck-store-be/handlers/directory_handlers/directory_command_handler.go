package directory_handlers

import (
	"database/sql"
)

type IDirectoryCommandHandler interface {
}

type DirectoryCommandHandler struct {
	db *sql.DB
}

func NewDirectoryCommandHandler(db *sql.DB) *DirectoryCommandHandler {
	return &DirectoryCommandHandler{
		db: db,
	}
}
