package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func Init() *sql.DB {
	var (
		host     = os.Getenv("HOST")
		port     = os.Getenv("DBPORT")
		user     = os.Getenv("USER")
		password = os.Getenv("PASSWORD")
		dbname   = os.Getenv("DBNAME")
	)

	pgInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	if DB, err := sql.Open("postgres", pgInfo); err == nil {
		fmt.Println("DB connected")
		return DB
	} else {
		log.Fatal(err)
	}

	return nil
}

func Close(DB *sql.DB) {
	if DB == nil {
		return
	}
	if err := DB.Close(); err != nil {
		log.Fatal(err)
	}
}
