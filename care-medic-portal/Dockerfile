# ARG NODE=node:18-alpine

# Stage 1: Install dependencies
FROM node:18
WORKDIR /app
COPY . .

ENV NODE_ENV production
RUN yarn install
RUN yarn build
RUN  ls ./

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy assets and the generated standalone server

COPY --chown=nextjs:nodejs  . .

USER nextjs

EXPOSE 3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT 3000

# Serve the app
CMD ["node", "server.js"]