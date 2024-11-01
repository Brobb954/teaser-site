package handlers

import (
	"fmt"
	"solmarket/backend/internal/db"
	"sort"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type FullMarket struct {
	Market  db.GetMarketRow
	Options []db.Predictionoption
}

func (h *Handlers) GetMarket(ctx *fiber.Ctx) error {

	fmt.Printf("GetMarket called with path: %s\n", ctx.Path())

	fmt.Printf("Request headers:\n")
	ctx.Request().Header.VisitAll(func(key, value []byte) {
		fmt.Printf("%s: %s\n", string(key), string(value))
	})

	id, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}
	fmt.Printf("Fetching market with ID: %d\n", id)

	market, err := h.Repo.GetMarket(ctx.Context(), int32(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).Send([]byte(err.Error()))
	}
	option, err := h.Repo.GetOptions(ctx.Context(), int32(id))

	marketFull := FullMarket{
		Market:  market,
		Options: option,
	}
	sort.Slice(marketFull.Options[:], func(i, j int) bool {
		return marketFull.Options[i].Optionid < marketFull.Options[j].Optionid
	})
	for i := 0; i < len(marketFull.Options); i++ {
		fmt.Println(marketFull.Options[i])
	}

	fmt.Printf("Successfully returning market data for ID: %d\n", id)

	return ctx.JSON(marketFull)

}
