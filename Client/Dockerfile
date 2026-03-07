# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json & install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Accept build-time secrets
ARG VITE_BACKEND_BASE_URL
ARG VITE_BACKEND_REFRESH_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Export to ENV so Vite can pick them up
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_REFRESH_URL=$VITE_BACKEND_REFRESH_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build frontend
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Optional: copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]