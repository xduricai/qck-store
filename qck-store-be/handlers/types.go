package handlers

import (
	"log"
)

type DirectoryResponse struct {
	Id       int    `json:"id"`
	IsRoot   bool   `json:"isRoot"`
	Name     string `json:"name"`
	Path     string `json:"path"`
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

type DirectoryMoveResponse struct {
	OldPath string `json:"oldPath"`
	NewPath string `json:"newPath"`
}

type DirectoryDeletionResponse struct {
	Size int    `json:"size"`
	Path string `json:"path"`
}

func (dir *DirectoryResponse) FormatDates() {
	if modified, err := FormatDate(dir.Modified); err == nil {
		dir.Modified = modified
	} else {
		dir.Modified = ""
		log.Println(err)
	}

	if created, err := FormatDate(dir.Created); err == nil {
		dir.Created = created
	} else {
		dir.Created = ""
		log.Println(err)
	}
}

func (file *FileResponse) FormatDates() {
	if modified, err := FormatDate(file.Modified); err == nil {
		file.Modified = modified
	} else {
		file.Modified = ""
		log.Println(err)
	}

	if created, err := FormatDate(file.Created); err == nil {
		file.Created = created
	} else {
		file.Created = ""
		log.Println(err)
	}
}
