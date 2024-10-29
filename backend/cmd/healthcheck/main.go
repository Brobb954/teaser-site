package main

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

func main() {
	time.Sleep(2 * time.Second)

	client := http.Client{
		Timeout: 5 * time.Second,
	}

	res, err := client.Get("http://localhost:8080/v1/healthcheck")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Health check failed: %v", err)
		os.Exit(1)
	}
	defer res.Body.Close()
	fmt.Printf("%+v", res.StatusCode)

	if res.StatusCode != http.StatusOK {
		fmt.Fprintf(os.Stderr, "Healthcheck returned: %v", err)
		os.Exit(1)
	}

	os.Exit(0)
}
