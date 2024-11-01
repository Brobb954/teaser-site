# Build stage
FROM oven/bun:1 AS builder
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
WORKDIR /app

# Install necessary production packages
RUN apk --no-cache add curl

# Copy built assets from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "server.js"]
