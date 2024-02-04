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
		routes.POST("/register", controller.Register)
	}

	return controller
}

func (c *UserController) GetAll(ctx *gin.Context) {
	users, status := c.userQueryHandler.GetAll()
	ctx.IndentedJSON(status, users)
}

func (c *UserController) Register(ctx *gin.Context) {
	var requestBody userh.RegistrationCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
	}

	if res, status := c.userCommandHandler.Register(&requestBody); status != http.StatusInternalServerError {
		ctx.JSON(status, res)
	} else {
		ctx.Status(status)
	}
}

func (c *UserController) Login(ctx *gin.Context) {
	var requestBody userh.LoginCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
	}

	if res, status := c.userCommandHandler.Login(&requestBody); status == http.StatusOK {
		ctx.JSON(status, res)
	} else {
		ctx.Status(status)
	}
}
