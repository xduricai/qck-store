package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/xduricai/qck-store/qck-store-be/handlers"
	dirh "github.com/xduricai/qck-store/qck-store-be/handlers/directory_handlers"
	fileh "github.com/xduricai/qck-store/qck-store-be/handlers/file_handlers"
	mw "github.com/xduricai/qck-store/qck-store-be/middleware"
)

type DirectoryController struct {
	directoryQueryHandler   dirh.IDirectoryQueryHandler
	directoryCommandHandler dirh.IDirectoryCommandHandler
	fileQueryHandler        fileh.IFileQueryHandler
	fileCommandHandler      fileh.IFileCommandHandler
	db                      *sql.DB
	fileSrc                 string
}

func RegisterDirectoryController(db *sql.DB, server *gin.Engine) *DirectoryController {
	var controller = &DirectoryController{
		directoryQueryHandler:   dirh.NewDirectoryQueryHandler(db),
		directoryCommandHandler: dirh.NewDirectoryCommandHandler(db),
		fileQueryHandler:        fileh.NewFileQueryHandler(db),
		fileCommandHandler:      fileh.NewFileCommandHandler(db),
		db:                      db,
		fileSrc:                 os.Getenv("FILESRC"),
	}

	var routes = server.Group("/directories")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/all", controller.GetAll)
		routes.GET("/content/:folderId", controller.GetDirectoryContent)
		routes.POST("create/:parentId", controller.CreateDirectory)
		routes.PUT("/move/:folderId", controller.MoveDirectory)
		routes.PATCH("/rename/:folderId", controller.RenameDirectory)
		routes.DELETE("/delete/:folderId", controller.DeleteDirectory)
	}

	return controller
}

func (c *DirectoryController) GetAll(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	dirs, status := c.directoryQueryHandler.GetAll(id)
	ctx.JSON(status, dirs)
}

func (c *DirectoryController) GetDirectoryContent(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	folderId := ctx.Param("folderId")

	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	var res handlers.DirectoryContentResponse

	if dirs, status := c.directoryQueryHandler.GetForDirectory(folderId, id); status != http.StatusOK {
		ctx.Status(status)
		return
	} else {
		res.Directories = dirs
	}

	if files, status := c.fileQueryHandler.GetForDirectory(folderId, id); status != http.StatusOK {
		ctx.Status(status)
		return
	} else {
		res.Files = files
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *DirectoryController) CreateDirectory(ctx *gin.Context) {
	parentId := ctx.Param("parentId")
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	folderName, ok := ParseRequestBodyString(ctx)
	if !ok {
		return
	}

	folder, status := c.directoryCommandHandler.CreateDirectory(folderName, parentId, id)
	ctx.JSON(status, folder)
}

func (c *DirectoryController) MoveDirectory(ctx *gin.Context) {
	folderId := ctx.Param("folderId")
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	parentId, ok := ParseRequestBodyString(ctx)
	if !ok {
		return
	}

	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		log.Println("An error occurred when creating transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	res, status := c.directoryCommandHandler.MoveDirectory(folderId, parentId, id, ctx, tx)
	if status != http.StatusOK {
		ctx.Status(status)
	}

	if err := tx.Commit(); err != nil {
		log.Println("An error occurred when commiting transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	ctx.JSON(status, res)
}

func (c *DirectoryController) RenameDirectory(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	folderId := ctx.Param("folderId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	name, ok := ParseRequestBodyString(ctx)
	if !ok {
		return
	}

	status := c.directoryCommandHandler.RenameDirectory(name, folderId, id)
	ctx.Status(status)
}

func (c *DirectoryController) DeleteDirectory(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	folderId := ctx.Param("folderId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		log.Println("An error occurred when creating transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	ids, size, status := c.fileCommandHandler.DeleteDirectoryChildren(folderId, id, ctx, tx)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}

	path, status := c.directoryCommandHandler.DeleteDirectory(folderId, id, ctx, tx)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}

	if err := tx.Commit(); err != nil {
		log.Println("An error occurred when commiting transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	for _, id := range ids {
		filePath := fmt.Sprint(c.fileSrc, id)
		if err := os.Remove(filePath); err != nil {
			log.Println("An error occurred while deleting file from storage", err)
		}
	}

	res := &handlers.DirectoryDeletionResponse{
		Size: size,
		Path: path,
	}
	ctx.JSON(status, res)
}
