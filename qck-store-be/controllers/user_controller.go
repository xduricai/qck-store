package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	userh "github.com/xduricai/qck-store/qck-store-be/handlers/user_handlers"
)

type UserController struct {
	userQueryHandler   userh.IUserQueryHandler
	userCommandHandler userh.IUSerCommandHandler
}

func RegisterUserController(db *sql.DB, server *gin.Engine) *UserController {
	var controller = &UserController{
		userQueryHandler:   userh.NewUserQueryHandler(db),
		userCommandHandler: userh.NewUserCommandHandler(db),
	}

	var routes = server.Group("/users")
	{
		routes.GET("/all", controller.GetAll)
		routes.POST("/login", controller.Login)
	}

	return controller
}

func (c *UserController) GetAll(ctx *gin.Context) {
	users, status := c.userQueryHandler.GetAll()
	ctx.IndentedJSON(status, users)
}

func (c *UserController) Login(ctx *gin.Context) {
	var requestBody userh.LoginCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
	}

	if result, status := c.userCommandHandler.Login(&requestBody); status == http.StatusOK {
		ctx.JSON(status, result)
	} else {
		ctx.Status(status)
	}
}
