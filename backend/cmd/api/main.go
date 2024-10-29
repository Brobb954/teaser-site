package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"solmarket/backend/internal/initialization"
	"syscall"
	"time"
)

func main() {

	config := initialization.GetConfig()

	app, err := initialization.NewApplication(config)
	if err != nil {
		log.Fatalf("Always should become application. Error: %v", err)
	}

	go func() {
		if err := app.Start(); err != nil {
			log.Fatalf("Server did not start properly. Error: %v", err)
			os.Exit(1)
		}
	}()

	wait := make(chan os.Signal, 1)
	signal.Notify(wait, os.Interrupt, syscall.SIGTERM)
	<-wait

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := app.Shutdown(ctx); err != nil {
		log.Fatalf("Server did not shutdown gracefully: %v", err)
	}

}
