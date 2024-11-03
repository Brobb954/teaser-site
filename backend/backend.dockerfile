# Build stage
FROM golang:1.23.2-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./

RUN go mod download

# Copy source code
COPY . .

# Build the main application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags=-static' \
    -o /app/server \
    ./cmd/api

# Final stage
FROM alpine:3.19

RUN apk add --no-cache curl ca-certificates tzdata

WORKDIR /app

# Copy binaries from builder
COPY --from=builder /app/server .

RUN adduser -D appuser && \
    chown -R appuser:appuser /app
USER appuser

# Set environment variables
ENV GO_ENV=production\
    TZ=UTC

EXPOSE 8000
# Run the binary
CMD ["./server"]
