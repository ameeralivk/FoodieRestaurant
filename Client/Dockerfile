# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Load secrets at build time
# This will not store the secret in the final image layers
RUN --mount=type=secret,id=env_file \
    export $(cat /run/secrets/env_file | xargs) && \
    echo "Loaded build secrets"

# Copy project files
COPY . .

# Build project using secrets as build args
ARG VITE_BACKEND_BASE_URL
ARG VITE_BACKEND_REFRESH_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY

ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_REFRESH_URL=$VITE_BACKEND_REFRESH_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]