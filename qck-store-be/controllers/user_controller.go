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
	userCommandHandler userh.IUserCommandHandler
	db                 *sql.DB
}

func RegisterUserController(db *sql.DB, server *gin.Engine) *UserController {
	var controller = &UserController{
		userQueryHandler:   userh.NewUserQueryHandler(db),
		userCommandHandler: userh.NewUserCommandHandler(db),
		db:                 db,
	}

	var routes = server.Group("/users")
	{
		routes.GET("/all", controller.GetAll) // TODO remove
		routes.POST("/login", controller.Login)
		routes.POST("/register", controller.Register)

		routes.GET("/authenticate", mw.Authenticate, controller.Authenticate)
		routes.POST("/logout", mw.Authenticate, controller.Logout)
		routes.PATCH("/update", mw.Authenticate, controller.Update)
		routes.PATCH("/password", mw.Authenticate, controller.ChangePassword)
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
		log.Println("Could not parse request body", err)
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

func (c *UserController) Logout(ctx *gin.Context) {
	ctx.SetCookie("Authorization", "", -1, "", "", false, true)
	ctx.Status(http.StatusOK)
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

func (c *UserController) Update(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	var requestBody userh.UpdateUserCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		log.Println("Could not parse request body", err)
		ctx.Status(http.StatusBadRequest)
		return
	}

	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		log.Println("An error occurred when creating transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	res, status := c.userCommandHandler.Update(&requestBody, id, ctx, tx)
	if status != http.StatusOK {
		ctx.Status(status)
	}

	if err := tx.Commit(); err != nil {
		log.Println("An error occurred when commiting transaction", err)
		ctx.Status(http.StatusInternalServerError)
		return
	}

	ctx.String(status, res)
}

func (c *UserController) ChangePassword(ctx *gin.Context) {
	id, ok := GetUserId(ctx)
	if !ok {
		ctx.Status(http.StatusInternalServerError)
		return
	}

	var requestBody userh.UpdatePasswordCommand

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}

	status := c.userCommandHandler.ChangePassword(&requestBody, id)
	ctx.Status(status)
}
