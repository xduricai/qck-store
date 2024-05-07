package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	dirh "github.com/xduricai/qck-store/qck-store-be/handlers/directory_handlers"
	mw "github.com/xduricai/qck-store/qck-store-be/middleware"
)

type DirectoryController struct {
	directoryQueryHandler   dirh.IDirectoryQueryHandler
	directoryCommandHandler dirh.IDirectoryCommandHandler
}

func RegisterDirectoryController(db *sql.DB, server *gin.Engine) *DirectoryController {
	var controller = &DirectoryController{
		directoryQueryHandler:   dirh.NewDirectoryQueryHandler(db),
		directoryCommandHandler: dirh.NewDirectoryCommandHandler(db),
	}

	var routes = server.Group("/directories")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/all", controller.GetAllForUser)
		routes.GET("/content/:folderid", controller.GetFolderContentForUser)
	}

	return controller
}

func (c *DirectoryController) GetAllForUser(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	dirs, status := c.directoryQueryHandler.GetAllForUser(id)
	ctx.JSON(status, dirs)
}

func (c *DirectoryController) GetFolderContentForUser(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	folderId := ctx.Param("folderid")

	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	if res, status := c.directoryQueryHandler.GetFolderContentForUser(id, folderId); status != http.StatusOK {
		ctx.Status(status)
	} else {
		ctx.JSON(status, res)
	}
}
