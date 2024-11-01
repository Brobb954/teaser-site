# Build stage
FROM golang:1.23.2 AS builder

WORKDIR /app

# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the main application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Build the healthcheck binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/healthcheck ./cmd/healthcheck

# Final stage
FROM alpine:3.19

WORKDIR /app

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Copy binaries from builder
COPY --from=builder /app/server .
COPY --from=builder /app/healthcheck /bin/healthcheck

# Set environment variables
ENV GO_ENV=production

EXPOSE 8000
RUN rm -rf /go/bin/air
# Run the binary
CMD ["./server"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/bin/healthcheck"]
