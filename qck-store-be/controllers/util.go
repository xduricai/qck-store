package controllers

import "github.com/gin-gonic/gin"

func GetUserId(ctx *gin.Context) (string, bool) {
	id, ok := ctx.Get("userId")
	if !ok {
		return "", ok
	}

	if idString, ok := id.(string); !ok {
		return "", ok
	} else {
		return idString, ok
	}
}
