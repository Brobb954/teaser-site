# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy package files
COPY package.json ./

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


# Copy built assets from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "start"]
