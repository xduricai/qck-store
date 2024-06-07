package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xduricai/qck-store/qck-store-be/handlers/user_handlers"
	mw "github.com/xduricai/qck-store/qck-store-be/middleware"
)

type AdminController struct {
	userQueryHandler user_handlers.IUserQueryHandler
}

func RegisterAdminController(db *sql.DB, server *gin.Engine) *AdminController {
	var controller = &AdminController{
		userQueryHandler: user_handlers.NewUserQueryHandler(db),
	}

	var routes = server.Group("/admin")
	routes.Use(mw.Authenticate, mw.AuthenticateAdmin)
	{
		routes.GET("/users", controller.GetAllUsers)
	}

	return controller
}

func (c *AdminController) GetAllUsers(ctx *gin.Context) {
	res, status := c.userQueryHandler.GetAll()
	if status != http.StatusOK {
		ctx.AbortWithStatus(http.StatusInternalServerError)
	}
	ctx.JSON(status, res)
}
