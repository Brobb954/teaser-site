# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
ENV NODE_ENV=production
RUN bun run build

# Production stage
FROM oven/bun:alpine AS runner
WORKDIR /app

RUN adduser -D nextjs && \
    chown -R nextjs:nextjs /app
USER nextjs

# Copy necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production

# The entry point is server.js in standalone mode
CMD ["bun", "run", "server.js"]
