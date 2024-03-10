package controllers

import (
	"database/sql"

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
		routes.GET("/root/:userId", controller.GetRootForUser)
	}

	return controller
}

func (c *DirectoryController) GetRootForUser(ctx *gin.Context) {
	userId := ctx.Param("userId")

	dirs, status := c.directoryQueryHandler.GetRootForUser(userId)
	ctx.IndentedJSON(status, dirs)
}
