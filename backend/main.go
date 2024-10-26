package main

import (
	"context"
	"embed"
	"log"
	"solmarket/backend/data"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pressly/goose/v3"

	"github.com/jackc/pgx/v5/stdlib"
)

type Handlers struct {
	Repo *data.Repo
}

//go:embed data/migrations/*.sql
var embedMigrations embed.FS

func NewHandlers(repo *data.Repo) *Handlers {
	return &Handlers{Repo: repo}
}

func main() {

	db, err := pgxpool.New(context.Background(), "postgres://postgres:Test@localhost:5432/postgres")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	conn := stdlib.OpenDBFromPool(db)

	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}
	if err := goose.Up(conn, "migrations"); err != nil {
		panic(err)
	}

	handlers := NewHandlers(data.NewRepo(db))

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		log.Printf("Client connected: %s %s", c.Method(), c.OriginalURL())
		return c.Next() // Continue to the next middleware or route handler
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // Or the URL of your frontend
		AllowMethods: "GET,POST,PATCH,DELETE",
	}))
	SetupApiV1(app, handlers)

	if err := app.Listen(":8000"); err != nil {
		log.Fatalf("Failed to start server %v", err)
	}

}

func SetupApiV1(app *fiber.App, handlers *Handlers) {
	v1 := app.Group("/v1")

	SetupMarketRoutes(v1, handlers)
}

func SetupMarketRoutes(grp fiber.Router, handlers *Handlers) {
	marketRoutes := grp.Group("/market")

	marketRoutes.Get("/:id", handlers.GetMarket)
	marketRoutes.Patch("/:marketId/option/:optionId", handlers.IncrementCounter)
}
