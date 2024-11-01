package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {

	res, err := http.Get("http://traefik/api/v1/healthcheck")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Health check failed after 3 attempts: %v\n", err)
		os.Exit(1)
	}
	defer res.Body.Close()

	fmt.Printf("%+v", res.StatusCode)

	body, _ := io.ReadAll(res.Body)
	fmt.Printf("Status: %d, Body: %s\n", res.StatusCode, string(body))

	if res.StatusCode != http.StatusOK {
		fmt.Fprintf(os.Stderr, "Healthcheck returned: %v", err)
		os.Exit(1)
	}

	os.Exit(0)
}
