package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/xduricai/qck-store/qck-store-be/controllers"
	"github.com/xduricai/qck-store/qck-store-be/database"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Could not retrieve environment variables")
	}

	DB := database.Init()
	defer database.Close(DB)

	server := gin.Default()
	controllers.RegisterUserController(DB, server)

	// TODO remove
	server.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	server.Run()
}
