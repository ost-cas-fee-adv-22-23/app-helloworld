# https://geshan.com.np/blog/2023/01/nextjs-docker/
# https://meeg.dev/blog/using-docker-compose-to-deploy-to-a-next-js-app-to-a-linux-app-service-in-azure

# Dependecy stage
FROM node:18-alpine as deps

# Needed to build Next.js
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# RUN --mount=type=secret,id=npm,target=/root/.npmrc npm ci

# Install app dependencies
RUN npm ci --production

# build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy the entire app directory to the working directory
COPY . .

# Next.js collects anonymous telemetry data about general usage, which we opt out from
# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN npm run build

# main stage that runs Next.js
FROM node:18-alpine AS runner
WORKDIR /app

# Set the environment variable for Next.js
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Creates a system user and group named nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copys the .next directory from builder stage to runner stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

# Expose the desired port (e.g., 3000) for the app
EXPOSE 3000

ENV PORT 3000

# Run the Next.js app
CMD ["npm", "start"]