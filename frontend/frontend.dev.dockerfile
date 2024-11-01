# Base development image
FROM oven/bun:1 AS dev

# Set working directory
WORKDIR /usr/src/app

# First, only copy dependency files
COPY package.json bun.lockb ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.bun \
    bun install

# Development setup
ENV NODE_ENV=development
EXPOSE 3000

# Add node_modules to path
ENV PATH /usr/src/app/node_modules/.bin:$PATH

CMD [ "bun", "run", "dev" ]
