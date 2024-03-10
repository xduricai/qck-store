package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	userh "github.com/xduricai/qck-store/qck-store-be/handlers/user_handlers"
	mw "github.com/xduricai/qck-store/qck-store-be/middleware"
	"github.com/xduricai/qck-store/qck-store-be/services"
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
		routes.GET("/authenticate", mw.Authenticate, controller.Authenticate)
		routes.GET("/all", controller.GetAll)
		routes.POST("/login", controller.Login)
		routes.POST("/register", controller.Register)
	}

	return controller
}

func (c *UserController) GetAll(ctx *gin.Context) {
	users, status := c.userQueryHandler.GetAll()
	ctx.JSON(status, users)
}

func (c *UserController) Register(ctx *gin.Context) {
	var requestBody userh.RegistrationCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}

	if res, status := c.userCommandHandler.Register(&requestBody); status != http.StatusOK {
		ctx.Status(status)
	} else {
		var token string
		if tokenStr, err := services.GenerateToken(res.Id); err != nil {
			log.Println(err)
			ctx.Status(http.StatusInternalServerError)
			return
		} else {
			token = tokenStr
		}

		ctx.SetSameSite(http.SameSiteLaxMode)
		ctx.SetCookie("Authorization", token, 36000*24*30, "", "", false, true)
		ctx.JSON(status, res)
	}
}

func (c *UserController) Login(ctx *gin.Context) {
	var requestBody userh.LoginCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}

	if res, status := c.userCommandHandler.Login(&requestBody); status != http.StatusOK {
		ctx.Status(status)
	} else {
		var token string
		if tokenStr, err := services.GenerateToken(res.Id); err != nil {
			log.Println(err)
			ctx.Status(http.StatusInternalServerError)
			return
		} else {
			token = tokenStr
		}

		ctx.SetSameSite(http.SameSiteLaxMode)
		ctx.SetCookie("Authorization", token, 36000*24*30, "", "", false, true)
		ctx.JSON(status, res)
	}
}

func (c *UserController) Authenticate(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	if res, status := c.userQueryHandler.GetUserDetails(id); status != http.StatusOK {
		ctx.Status(status)
	} else {
		ctx.JSON(http.StatusOK, res)
	}
}
