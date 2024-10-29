package handlers

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) HealthCheck(ctx *fiber.Ctx) error {

	if err := h.Repo.DB.Ping(ctx.Context()); err != nil {
		fmt.Fprintf(os.Stderr, "could not ping db: %v", err)
		os.Exit(1)
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "healthy",
	})
}
