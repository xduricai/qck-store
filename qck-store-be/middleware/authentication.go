package middleware

import (
	"log"
	"net/http"
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

	userId := claims["user"].(int)
	expiration := claims["expiration"].(int64)

	if userId <= 0 || expiration < time.Now().Unix() {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	ctx.Set("userId", userId)
	ctx.Next()
}
