package controllers

import (
	"bytes"
	"database/sql"
	"log"
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
		routes.POST("create/:parentId", controller.CreateDirectory)
		routes.PUT("/move/:folderId")
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

func (c *DirectoryController) CreateDirectory(ctx *gin.Context) {
	parentId := ctx.Param("parentId")
	// TODO create in root if no parentId
	log.Println(parentId)
	ctx.Status(http.StatusOK)

	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(ctx.Request.Body); err != nil {
		log.Println("An error occurred while reading the request body", err)
		ctx.Status(http.StatusBadRequest)
		return
	}
	folderName := buf.String()

	folder, status := c.directoryCommandHandler.CreateDirectory(folderName, parentId, id)
	ctx.JSON(status, folder)
}

func (c *DirectoryController) RenameDirectory(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	folderId := ctx.Param("folderId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(ctx.Request.Body); err != nil {
		log.Println("An error occurred while reading the request body", err)
		ctx.Status(http.StatusBadRequest)
		return
	}
	name := buf.String()

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

	status := c.directoryCommandHandler.DeleteDirectory(folderId, id)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}
	// update size, delete folders, delete files

	// filePath := fmt.Sprintf("%s%s", c.fileSrc, fileId)
	// if err := os.Remove(filePath); err != nil {
	// 	log.Println("An error occurred while deleting file from storage")
	// }

	ctx.Status(status)
}
