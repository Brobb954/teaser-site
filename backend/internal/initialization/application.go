package initialization

import (
	"context"
	"fmt"
	"log/slog"
	"solmarket/backend/internal/db"
	"solmarket/backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Application struct {
	config Config
	fiber  *fiber.App
	db     *pgxpool.Pool
	logger *slog.Logger
}

func NewApplication(config Config) (*Application, error) {
	app := &Application{
		config: config,
		fiber: fiber.New(fiber.Config{
			ErrorHandler: customErrorHandler,
		}),
	}

	if err := app.setupDatabase(); err != nil {
		return nil, fmt.Errorf("failed to setup database: %w", err)
	}

	app.setupMiddleware()
	app.setupRoutes()

	return app, nil
}

func (app *Application) Start() error {
	app.fiber.Use(func(c *fiber.Ctx) error {
		app.logger.Info("received request",
			"method", c.Method(),
			"path", c.Path(),
			"ip", c.IP())
		return c.Next()
	})

	return app.fiber.Listen(":" + app.config.ServerPort)
}

func (app *Application) setupRoutes() {
	handlers := handlers.NewHandlers(db.NewRepo(app.db))

	setupApiV1(app.fiber, handlers)
}

func setupApiV1(app *fiber.App, handlers *handlers.Handlers) {
	v1 := app.Group("/v1")

	CheckHealth(v1, handlers)
	SetupMarketRoutes(v1, handlers)
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	return c.Status(code).JSON(fiber.Map{
		"error": err.Error(),
	})
}

func (app *Application) Cleanup() {
	if app.db != nil {
		app.db.Close()
	}
}

func (app *Application) Shutdown(ctx context.Context) error {
	// Graceful shutdown for Fiber
	if err := app.fiber.ShutdownWithContext(ctx); err != nil {
		return err
	}

	// Close db connection pool
	app.Cleanup()
	return nil
}
