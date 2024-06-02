package services

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// TODO add is admin
func GenerateToken(id int) (string, error) {
	key := os.Getenv("PK")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user":       id,
		"expiration": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	return token.SignedString([]byte(key))
}

func ParseToken(token string) (*jwt.Token, error) {
	key := os.Getenv("PK")

	return jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})
}
