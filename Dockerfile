# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for healthchecks
RUN apk --no-cache add curl

# Create directories if they don't exist and set proper permissions
RUN mkdir -p /usr/share/nginx/html/css \
  && mkdir -p /usr/share/nginx/html/js \
  && mkdir -p /usr/share/nginx/html/images \
  && chown -R nginx:nginx /usr/share/nginx/html \
  && chmod -R 755 /usr/share/nginx/html \
  && chown -R nginx:nginx /var/cache/nginx \
  && chown -R nginx:nginx /var/log/nginx \
  && touch /var/run/nginx.pid \
  && chown -R nginx:nginx /var/run/nginx.pid

# Copy built static files from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Clean up default nginx config if needed, or use custom
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions for copied files
RUN chown -R nginx:nginx /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Set user to non-root for better security
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
