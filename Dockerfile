# https://geshan.com.np/blog/2023/01/nextjs-docker/
# https://betterprogramming.pub/write-optimised-dockerfiles-for-next-js-d644b628c570

# build stage
FROM node:18-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package.json ./package-lock.json ./
ARG NEXT_PUBLIC_QWACKER_API_URL
ENV NEXT_PUBLIC_QWACKER_API_URL=${NEXT_PUBLIC_QWACKER_API_URL} \
    PORT=3000

# Adds the npmrc_secret file into docker path .npmrc. It is declared as secret.
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

# Set the environment variable for Next.js to signal that it should enable optimizations.
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copys the .next directory from builder stage to runner stage
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Expose the desired port (e.g., 3000) for the app
EXPOSE 3000

USER node

ENV PORT 3000

# Run the Next.js app
CMD ["node", "server.js"]