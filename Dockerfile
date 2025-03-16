FROM nginx:alpine

# Install curl for healthchecks
RUN apk --no-cache add curl

# Create directories if they don't exist
RUN mkdir -p /usr/share/nginx/html/css \
    && mkdir -p /usr/share/nginx/html/js \
    && mkdir -p /usr/share/nginx/html/images

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/

# Configure nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
