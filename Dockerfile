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

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/

# Configure nginx
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
