package main

import (
	"fmt"
	"reflect"
	"solmarket/backend/data"
	"sort"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type FullMarket struct {
	Market  data.GetMarketRow
	Options []data.Predictionoption
}

func (h *Handlers) GetMarket(ctx *fiber.Ctx) error {

	id, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	market, err := h.Repo.GetMarket(ctx.Context(), int32(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).Send([]byte(err.Error()))
	}
	option, err := h.Repo.GetOptions(ctx.Context(), int32(id))

	marketFull := FullMarket{
		Market:  market,
		Options: option,
	}
	fmt.Println(marketFull.Market)
	sort.Slice(marketFull.Options[:], func(i, j int) bool {
		return marketFull.Options[i].Optionid < marketFull.Options[j].Optionid
	})
	for i := 0; i < len(marketFull.Options); i++ {
		fmt.Println(marketFull.Options[i])
	}
	return ctx.JSON(marketFull)

}

func (h *Handlers) IncrementCounter(ctx *fiber.Ctx) error {

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
	print(rows, volume)
	if volume < 1 || rows < 1 {
		return ctx.Status(fiber.StatusInternalServerError).SendString("Volume or Rows Not Updated")
	}

	fmt.Print(reflect.TypeOf(ctx.Status(fiber.StatusAccepted).SendStatus(200)))

	return ctx.Status(fiber.StatusAccepted).SendStatus(200)
}
