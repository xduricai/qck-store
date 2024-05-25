package controllers

import (
	"database/sql"
	"net/http"

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
}

func RegisterDirectoryController(db *sql.DB, server *gin.Engine) *DirectoryController {
	var controller = &DirectoryController{
		directoryQueryHandler:   dirh.NewDirectoryQueryHandler(db),
		directoryCommandHandler: dirh.NewDirectoryCommandHandler(db),
		fileQueryHandler:        fileh.NewFileQueryHandler(db),
	}

	var routes = server.Group("/directories")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/all", controller.GetAll)
		routes.GET("/content/:folderId", controller.GetFolderContent)
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

func (c *DirectoryController) GetFolderContent(ctx *gin.Context) {
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
