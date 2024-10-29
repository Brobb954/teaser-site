package handlers

import (
	"solmarket/backend/internal/db"
)

type Handlers struct {
	Repo *db.Repo
}

func NewHandlers(repo *db.Repo) *Handlers {
	return &Handlers{Repo: repo}
}
