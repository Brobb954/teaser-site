# Create a stage for building the application and installing Air.
ARG GO_VERSION=1.23.2
FROM --platform=$BUILDPLATFORM golang:${GO_VERSION} AS build
LABEL org.opencontainers.image.source=https://github.com/brobb954/teaser-site
WORKDIR /app

# Install Air for live reloading
RUN go install github.com/air-verse/air@latest

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go mod download -x

# This is the architecture you're building for, which is passed in by the builder.
ARG TARGETARCH

# Build the application.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,target=. \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server .

################################################################################
# Create a new stage for production without Air, running the compiled binary.
FROM alpine:latest AS final

LABEL org.opencontainers.image.source=https://github.com/brobb954/teaser-site

# Install any runtime dependencies that are needed to run your application.
RUN --mount=type=cache,target=/var/cache/apk \
    apk --update add \
        ca-certificates \
        tzdata \
        && \
        update-ca-certificates

# Create a non-privileged user to run the app.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
USER appuser

# Copy the compiled binary from the "build" stage.
COPY --from=build /bin/server /bin/
COPY ./migrations ./migrations
COPY ./templates ./templates
COPY ./static ./static

ENV MIGRATIONS_URL=file://migrations

# Expose the port that the application listens on.
EXPOSE 8000

# Run the compiled Go application in production mode
ENTRYPOINT [ "/bin/server" ]
