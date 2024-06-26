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
	db                 *sql.DB
	fileSrc            string
}

func RegisterFileController(db *sql.DB, server *gin.Engine) *FileController {
	var controller = &FileController{
		userQueryHandler:   userh.NewUserQueryHandler(db),
		fileQueryHandler:   fileh.NewFileQueryHandler(db),
		fileCommandHandler: fileh.NewFileCommandHandler(db),
		db:                 db,
		fileSrc:            os.Getenv("FILESRC"),
	}

	var routes = server.Group("/files")
	routes.Use(mw.Authenticate)
	{
		routes.GET("/download/:fileId", controller.DownloadFile)
		routes.POST("/upload", controller.UploadFile)
		routes.PUT("/move/:fileId", controller.MoveFile)
		routes.PATCH("/rename/:fileId", controller.RenameFile)
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

	filePath := fmt.Sprint(c.fileSrc, fileId)
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

	name := ctx.PostForm("name")
	folderId := ctx.PostForm("folderId")

	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		log.Println("An error occurred when creating transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	res, status := c.fileCommandHandler.UploadFile(name, folderId, id, file.Size, ctx, tx)
	if status != 200 {
		ctx.Status(status)
		return
	}

	filePath := fmt.Sprint(c.fileSrc, res.Id)
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		log.Println("An error occurred while saving file", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(); err != nil {
		log.Println("An error occurred when commiting transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	ctx.JSON(status, res)
}

func (c *FileController) RenameFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	fileId := ctx.Param("fileId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	name, ok := ParseRequestBodyString(ctx)
	if !ok {
		return
	}

	time, status := c.fileCommandHandler.RenameFile(name, fileId, id)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}
	ctx.JSON(status, time)
}

func (c *FileController) MoveFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	fileId := ctx.Param("fileId")
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	folderId, ok := ParseRequestBodyString(ctx)
	if !ok {
		return
	}

	time, status := c.fileCommandHandler.MoveFile(folderId, fileId, id)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}
	ctx.JSON(status, time)
}

func (c *FileController) DeleteFile(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	fileId := ctx.Param("fileId")
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

	size, status := c.fileCommandHandler.DeleteFile(fileId, id, ctx, tx)
	if status != http.StatusOK {
		ctx.Status(status)
		return
	}

	filePath := fmt.Sprint(c.fileSrc, fileId)
	if err := os.Remove(filePath); err != nil {
		log.Println("An error occurred while deleting file from storage")
		ctx.Status(http.StatusInternalServerError)
	}

	if err := tx.Commit(); err != nil {
		log.Println("An error occurred when commiting transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	ctx.JSON(status, size)
}
