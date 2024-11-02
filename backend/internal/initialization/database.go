package initialization

import (
	"context"
	"fmt"
	"log"
	"solmarket/backend/internal/migrations"

	"github.com/jackc/pgx/v5/pgxpool"
)

func (app *Application) setupDatabase() error {
	// Build connection string
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		app.config.DBUser,
		app.config.DBPassword,
		app.config.DBHost,
		app.config.DBPort,
		app.config.DBName,
	)

	fmt.Printf("postgres://%s:%s@%s:%s/%s",
		app.config.DBUser,
		app.config.DBPassword,
		app.config.DBHost,
		app.config.DBPort,
		app.config.DBName,
	)
	var err error
	app.db, err = pgxpool.New(context.Background(), dsn)
	if err != nil {
		return fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Verify connection
	if err := app.db.Ping(context.Background()); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	conn, err := app.db.Acquire(context.Background())
	migrator, err := migrations.NewMigrator(conn.Conn())
	if err != nil {
		fmt.Print("Could not create migrator")
		panic(err)
	}

	now, exp, info, err := migrator.Info()
	if err != nil {
		fmt.Print("If we get migrator this should never panic")
		panic(err)
	}

	if now < exp {
		fmt.Println("Migration needed. Current state:")
		fmt.Println(info)

		if err = migrator.Migrate(); err != nil {
			log.Fatal("Migration unsuccessful")
		}

		fmt.Println("Migration Successful")
	} else {
		fmt.Println("No migrations required")
	}
	return nil
}
