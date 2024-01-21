package main

import (
	"encoding/hex"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/sha3"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run()
}

// TODO move elsewhere
func generatePasswordHash(password *string) string {
	pw := []byte(*password)
	hash := make([]byte, 64)
	sha3.ShakeSum256(hash, pw)
	return hex.EncodeToString(hash)
}
