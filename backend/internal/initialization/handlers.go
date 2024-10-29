package initialization

import (
	"github.com/gofiber/fiber/v2"
	"solmarket/backend/internal/handlers"
)

func SetupMarketRoutes(grp fiber.Router, handlers *handlers.Handlers) {
	marketRoutes := grp.Group("/market")

	marketRoutes.Get("/:id", handlers.GetMarket)
	marketRoutes.Patch("/:marketId/option/:optionId", handlers.IncrementCounter)
}

func CheckHealth(v1 fiber.Router, handlers *handlers.Handlers) {

	v1.Get("/healthcheck", handlers.HealthCheck)
}
