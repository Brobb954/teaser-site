ARG GO_VERSION=1.23.2
FROM golang:${GO_VERSION}
LABEL org.opencontainers.image.source=https://github.com/brobb954/teaser-site
WORKDIR /app

# Install Air for live reloading
RUN go install github.com/air-verse/air@latest

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl

# Copy the Air config file
COPY .air.toml ./

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build healthcheck binary
RUN CGO_ENABLED=0 go build -o /bin/healthcheck ./cmd/healthcheck

# Add healthcheck
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD ["/bin/healthcheck"]

# Expose port
EXPOSE 8080

# Run air for hot reloading
CMD ["air", "-c", ".air.toml"]
