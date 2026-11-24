package main

import (
	"io"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
)

func main() {
	addr := os.Getenv("HTTP_ADDR")
	if addr == "" {
		addr = "127.0.0.1:8080"
	}

	server := &http.Server{
		Addr:              addr,
		Handler:           newRouter(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	slog.Info("starting HTTP server", "addr", addr)
	if err := server.ListenAndServe(); err != nil {
		slog.Error("HTTP server stopped", "error", err)
		os.Exit(1)
	}
}

func newRouter() http.Handler {
	router := chi.NewRouter()
	router.Get("/health", health)
	return router
}

func health(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if _, err := io.WriteString(w, "{\"status\":\"ok\"}\n"); err != nil {
		slog.Debug("could not write health response", "error", err)
	}
}
