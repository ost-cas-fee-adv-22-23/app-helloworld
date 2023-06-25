# https://geshan.com.np/blog/2023/01/nextjs-docker/
# https://meeg.dev/blog/using-docker-compose-to-deploy-to-a-next-js-app-to-a-linux-app-service-in-azure
# https://steveholgado.com/nginx-for-nextjs/
# https://betterprogramming.pub/write-optimised-dockerfiles-for-next-js-d644b628c570

# build stage
FROM node:18-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Install PM2 globally. PM2 ensuring that our app is always restarted after crashing
# RUN npm install --global pm2
COPY ./package.json ./package-lock.json ./
ARG NEXT_PUBLIC_QWACKER_API_URL
ENV NEXT_PUBLIC_QWACKER_API_URL=${NEXT_PUBLIC_QWACKER_API_URL} \
    PORT=3000

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

# Copys the .next directory from builder stage to runner stage
COPY --from=builder /app/package.json /app/package-lock.json /app/next.config.js ./
# COPY --from=builder /app/node_modules ./node_modules
RUN --mount=type=secret,id=npmrc_secret,target=/root/.npmrc npm ci
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public

# Expose the desired port (e.g., 3000) for the app
EXPOSE 3000

USER node

ENV PORT 3000

# Run the Next.js app
CMD ["npm", "--", "start"]
# CMD [ "pm2-runtime", "npm", "--", "start" ]

# docker build . -f Dockerfile -t app-helloworld --build-arg NEXT_PUBLIC_QWACKER_API_URL=https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/ --secret id=npmrc_secret,src=$HOME/.npmrc
# docker run -p 3000:3000 --env-file ./.env --rm --name app-helloworld app-helloworld