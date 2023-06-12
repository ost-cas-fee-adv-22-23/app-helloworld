# https://geshan.com.np/blog/2023/01/nextjs-docker/
# https://meeg.dev/blog/using-docker-compose-to-deploy-to-a-next-js-app-to-a-linux-app-service-in-azure

# build stage
FROM node:18-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./

# Could not use that
RUN --mount=type=secret,id=npmrc_secret,target=/root/.npmrc npm ci
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
COPY --from=builder /app/package.json /app/package-lock.json /app/next.config.js ./
RUN --mount=type=secret,id=npmrc_secret,target=/root/.npmrc npm ci
COPY --from=builder --chown=nextjs:node /app/.next ./.next
COPY --from=builder --chown=nextjs:node /app/public ./public

USER nextjs

# Expose the desired port (e.g., 3000) for the app
EXPOSE 3000

ENV PORT 3000

# Run the Next.js app
CMD ["npm", "start"]