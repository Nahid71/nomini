# ==========================================
# Stage 1: Build & Prepare Backend
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy dependency specifications
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client & Build TypeScript
RUN npx prisma generate
RUN npm run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4000

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy generated Prisma Client and compiled NestJS files from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Entrypoint script to run migrations on startup before starting backend
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && (node dist/src/main.js || node dist/main.js)"]
