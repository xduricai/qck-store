package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
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
	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Origin", "Content-Type", "Accept", "Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	controllers.RegisterUserController(DB, server)
	controllers.RegisterDirectoryController(DB, server)
	controllers.RegisterFileController(DB, server)
	controllers.RegisterSearchController(DB, server)
	controllers.RegisterAdminController(DB, server)

	server.Run()
}
