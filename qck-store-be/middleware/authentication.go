package middleware

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/xduricai/qck-store/qck-store-be/services"
)

func Authenticate(ctx *gin.Context) {
	tokenStr, err := ctx.Cookie("Authorization")
	if err != nil {
		log.Println(err)
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, err := services.ParseToken(tokenStr)
	if err != nil {
		log.Println(err)
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	userId := claims["user"].(float64)
	role := claims["role"].(string)
	expiration := claims["expiration"].(float64)

	if userId <= 0 || int64(expiration) < time.Now().Unix() {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	formattedId := strconv.FormatFloat(userId, 'f', -1, 64)
	ctx.Set("userId", formattedId)
	ctx.Set("role", role)
	ctx.Next()
}

func AuthenticateAdmin(ctx *gin.Context) {
	role, ok := ctx.Get("role")
	if !ok || role != "admin" {
		ctx.AbortWithStatus(http.StatusUnauthorized)
	}
	ctx.Next()
}
