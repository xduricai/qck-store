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

type SearchController struct {
	fileQueryHandler      fileh.IFileQueryHandler
	directoryQueryHandler dirh.IDirectoryQueryHandler
}

func RegisterSearchController(db *sql.DB, server *gin.Engine) *SearchController {
	var controller = &SearchController{
		fileQueryHandler:      fileh.NewFileQueryHandler(db),
		directoryQueryHandler: dirh.NewDirectoryQueryHandler(db),
	}

	var routes = server.Group("/search")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/:query", controller.GetSearchResults)
	}

	return controller
}

func (c *SearchController) GetSearchResults(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	query := ctx.Param("query")

	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	var res handlers.DirectoryContentResponse

	if dirs, status := c.directoryQueryHandler.GetByName(query, id); status != http.StatusOK {
		ctx.Status(status)
		return
	} else {
		res.Directories = dirs
	}

	if files, status := c.fileQueryHandler.GetByName(query, id); status != http.StatusOK {
		ctx.Status(status)
		return
	} else {
		res.Files = files
	}

	ctx.JSON(http.StatusOK, res)
}
