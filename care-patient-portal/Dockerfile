# # Build Stage
# FROM node:18 as build
# WORKDIR /patient

# COPY package.json .
# RUN yarn install --frozen-lockfile

# COPY . .
# RUN yarn build

# # Nginx Stage
# FROM nginx

# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# WORKDIR /usr/share/nginx/html
# COPY --from=build /patient/build ./


#Stage 1
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
COPY . .
RUN yarn build

#Stage 2
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html