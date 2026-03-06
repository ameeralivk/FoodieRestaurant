# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Set environment variable via build args (no local .env needed)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy all frontend code
COPY . .

# Build the frontend
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# Copy the built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]