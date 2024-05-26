package controllers

import (
	"bytes"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

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

func ParseRequestBodyString(ctx *gin.Context) (string, bool) {
	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(ctx.Request.Body); err != nil {
		log.Println("An error occurred while reading the request body", err)
		ctx.Status(http.StatusBadRequest)
		return "", false
	}
	return buf.String(), true
}
