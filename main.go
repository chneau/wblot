package main

import (
	"log"
	"os"
	"os/signal"

	"github.com/gin-gonic/gin"
)

func init() {
	log.SetPrefix("[WBLOT] ")
	log.SetOutput(os.Stdout)
	log.SetFlags(log.Ltime | log.Lshortfile)
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	go func() {
		<-quit
		println()
		os.Exit(0)
	}()
}

func ce(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {
	r := gin.Default()
	r.Static("/", "public")
	log.Println("http://127.0.0.1:8080")
	err := r.Run()
	ce(err)
}
