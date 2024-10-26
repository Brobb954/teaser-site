package data

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repo struct {
	*Queries
	DB *pgxpool.Pool
}

func NewRepo(db *pgxpool.Pool) *Repo {
	return &Repo{
		DB:      db,
		Queries: New(db),
	}
}
