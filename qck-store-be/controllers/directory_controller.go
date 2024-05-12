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

	if res, status := c.directoryQueryHandler.GetFolderContent(id, folderId); status != http.StatusOK {
		ctx.Status(status)
	} else {
		ctx.JSON(status, res)
	}
}
