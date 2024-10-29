package initialization

import (
	"log/slog"
	"os"
	"time"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func (app *Application) setupMiddleware() {

	app.fiber.Use(cors.New(cors.Config{
		AllowOrigins: app.config.AllowedOrigins,
		AllowMethods: "GET,POST,PATCH,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.fiber.Use(recover.New())

	app.logger = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level:     slog.LevelInfo,
		AddSource: true,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				return slog.Attr{
					Key:   a.Key,
					Value: slog.StringValue(time.Now().UTC().Format(time.RFC3339)),
				}
			}
			return a
		},
	}))

}

func (app *Application) logError(msg string, err error, fields ...any) {
	allFields := append([]any{"error", err}, fields...)
	app.logger.Error(msg, allFields...)
}

func (app *Application) logInfo(msg string, fields ...any) {
	app.logger.Info(msg, fields...)
}

func (app *Application) logDebug(msg string, fields ...any) {
	app.logger.Debug(msg, fields...)
}
