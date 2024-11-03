# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build the application
ENV NODE_ENV=production
RUN bun run build

# Production stage
FROM oven/bun:alpine AS runner
WORKDIR /app

# Copy necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# The entry point is server.js in standalone mode
CMD ["bun", "run", "server.js"]
