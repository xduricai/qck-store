package directory_handlers

import (
	"log"

	"github.com/xduricai/qck-store/qck-store-be/handlers"
)

type DirectoryResponse struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	IsRoot   bool   `json:"isRoot"`
	Modified string `json:"modified"`
	Created  string `json:"created"`
}

type FileResponse struct {
	Id       int    `json:"id"`
	Size     int    `json:"size"`
	Name     string `json:"name"`
	Modified string `json:"modified"`
	Created  string `json:"created"`
}

type DirectoryContentResponse struct {
	Files       []FileResponse      `json:"files"`
	Directories []DirectoryResponse `json:"directories"`
}

func (dir *DirectoryResponse) FormatDates() {
	if modified, err := handlers.FormatDate(dir.Modified); err == nil {
		dir.Modified = modified
	} else {
		dir.Modified = ""
		log.Println(err)
	}

	if created, err := handlers.FormatDate(dir.Created); err == nil {
		dir.Created = created
	} else {
		dir.Created = ""
		log.Println(err)
	}
}

func (file *FileResponse) FormatDates() {
	if modified, err := handlers.FormatDate(file.Modified); err == nil {
		file.Modified = modified
	} else {
		file.Modified = ""
		log.Println(err)
	}

	if created, err := handlers.FormatDate(file.Created); err == nil {
		file.Created = created
	} else {
		file.Created = ""
		log.Println(err)
	}
}
