# Stage 1: Build stage
FROM node:18 as build

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies including devDependencies
ENV NODE_ENV=development
RUN yarn install --frozen-lockfile


# Set environment variables for build
#ENV VITE_API_URL="https://api-pillmartdev.carelyo.com/api"
#ENV VITE_LOGIN_URL="https://pillmartdev.carelyo.com"
ENV NODE_ENV=production
ENV PATH="./node_modules/.bin:$PATH"

# Copy the rest of your source code
COPY . .

# Build the application
RUN yarn run build

# Stage 2: Serve stage with Nginx
FROM nginx:1.21

# Copy custom Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built files from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html