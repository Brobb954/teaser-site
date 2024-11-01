package main

import (
	"context"
	"fmt"
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

	errChan := make(chan error, 1)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		if err := app.Start(); err != nil {
			errChan <- fmt.Errorf("Did not start: %v", err)
		}
	}()

	select {
	case err := <-errChan:
		log.Fatalf("Server error recieved: %v", err)
		os.Exit(1)
	case sig := <-sigChan:
		fmt.Printf("Shutdown signal received: %v", sig)

	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := app.Shutdown(ctx); err != nil {
		log.Fatalf("Server did not shutdown gracefully: %v", err)
	}

}
