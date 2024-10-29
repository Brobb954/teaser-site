package migrations

import (
	"context"
	"embed"
	"fmt"
	"io/fs"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/tern/v2/migrate"
)

const versionTable = "db_version"

type Migrator struct {
	migrator *migrate.Migrator
}

//go:embed data/*.sql
var migrationFiles embed.FS

func NewMigrator(db *pgx.Conn) (Migrator, error) {

	migrator, err := migrate.NewMigratorEx(
		context.Background(), db, versionTable,
		&migrate.MigratorOptions{DisableTx: false},
	)
	if err != nil {
		return Migrator{}, err
	}

	migrationRoot, err := fs.Sub(migrationFiles, "data")

	if err = migrator.LoadMigrations(migrationRoot); err != nil {
		return Migrator{}, err
	}

	return Migrator{
		migrator: migrator,
	}, nil
}

func (m Migrator) Info() (int32, int32, string, error) {

	version, err := m.migrator.GetCurrentVersion(context.Background())
	if err != nil {
		return 0, 0, "", err
	}

	info := ""

	var last int32

	for _, thisMigration := range m.migrator.Migrations {
		last = thisMigration.Sequence

		cur := version == thisMigration.Sequence
		indicator := " "
		if cur {
			indicator = "->"
		}

		info = info + fmt.Sprintf(
			"%2s %3d %s\n",
			indicator,
			thisMigration.Sequence, thisMigration.Name,
		)
	}
	return version, last, info, nil
}

func (m Migrator) Migrate() error {
	err := m.migrator.Migrate(context.Background())
	return err
}

func (m Migrator) MigrateTo(ver int32) error {
	err := m.migrator.MigrateTo(context.Background(), ver)
	return err
}