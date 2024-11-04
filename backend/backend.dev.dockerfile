ARG GO_VERSION=1.23.2
FROM golang:${GO_VERSION}

WORKDIR /app

# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Install Air for live reloading
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    go install github.com/air-verse/air@latest

COPY . .
# Build healthcheck binary with go cache
RUN --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -o /bin/healthcheck ./cmd/healthcheck

# Create tmp directory for Air
RUN mkdir -p tmp

# Install tini for proper signal handling
RUN apt-get update && apt-get install -y tini

# Create the Air config file
COPY .air.toml .

EXPOSE 8000

# Use tini as init process
ENTRYPOINT ["/usr/bin/tini", "--"]

# Run Air with proper signal handling
CMD air -c .air.toml
