package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) HealthCheck(ctx *fiber.Ctx) error {

	if err := h.Repo.DB.Ping(ctx.Context()); err != nil {
		return ctx.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"status": "unhealthy",
			"error":  "database connection failed",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "healthy",
	})
}
