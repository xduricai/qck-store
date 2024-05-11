package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	fileh "github.com/xduricai/qck-store/qck-store-be/handlers/file_handlers"
	userh "github.com/xduricai/qck-store/qck-store-be/handlers/user_handlers"
	mw "github.com/xduricai/qck-store/qck-store-be/middleware"
)

type FileController struct {
	userQueryHandler   userh.IUserQueryHandler
	fileQueryHandler   fileh.IFileQueryHandler
	fileCommandHandler fileh.IFileCommandHandler
	fileSrc            string
}

func RegisterFileController(db *sql.DB, server *gin.Engine) *FileController {
	var controller = &FileController{
		userQueryHandler:   userh.NewUserQueryHandler(db),
		fileQueryHandler:   fileh.NewFileQueryHandler(db),
		fileCommandHandler: fileh.NewFileCommandHandler(db),
		fileSrc:            os.Getenv("FILESRC"),
	}

	var routes = server.Group("/files")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/download/:fileId", controller.DownloadFile)
		routes.POST("/upload", controller.UploadFile)
		routes.DELETE("/delete/:fileId", controller.DeleteFile)
	}

	return controller
}

func (c *FileController) DownloadFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	fileId := ctx.Param("fileId")
	fileName := c.fileQueryHandler.GetFileName(fileId, id)
	if len(fileName) == 0 {
		ctx.Status(http.StatusNotFound)
		return
	}

	filePath := fmt.Sprintf("%s%s", c.fileSrc, fileId)
	ctx.FileAttachment(filePath, fileName)
}

func (c *FileController) UploadFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}

	if fits := c.userQueryHandler.FileFits(file.Size, id); !fits {
		ctx.Status(http.StatusPreconditionFailed)
		return
	}

	//TODO finish
	name := ctx.PostForm("name")
	folderId := ctx.PostForm("folderId")
	fileId, status := c.fileCommandHandler.UploadFile(name, folderId, id)
	ctx.JSON(status, fileId)

	filePath := fmt.Sprintf("%s%d", c.fileSrc, fileId)
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		log.Println(err)
		ctx.Status(http.StatusInternalServerError)
		return
	}
}

func (c *FileController) DeleteFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	fileId := ctx.Param("fileId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	status := c.fileCommandHandler.DeleteFile(fileId, id)
	ctx.Status(status)
}

/*
UPDATE Cars
SET Name = REPLACE(Name, 'train', 'plane')
WHERE name LIKE 'train%';

SELECT * FROM Cars;
*/
