# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy environment variables
COPY .env ./

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
CMD ["npm", "run", "dev"]