package handlers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) IncrementCounter(ctx *fiber.Ctx) error {
	fmt.Println("In handler")

	optionId, err := strconv.ParseInt(ctx.Params("optionId"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}
	marketId, err := strconv.ParseInt(ctx.Params("marketId"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	rows, err := h.Repo.IncrementCount(ctx.Context(), int32(optionId))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).Send([]byte(err.Error()))
	}
	volume, err := h.Repo.IncrementVolume(ctx.Context(), int32(marketId))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).Send([]byte(err.Error()))
	}
	if volume < 1 || rows < 1 {
		return ctx.Status(fiber.StatusInternalServerError).SendString("Volume or Rows Not Updated")
	}

	return ctx.Status(fiber.StatusAccepted).SendStatus(200)
}
