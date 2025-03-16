#!/bin/bash

# Exit on error
set -e

echo "Starting Docker service..."
# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

echo "Building Lochness website container..."
docker build -t lochness-website .

echo "Starting Lochness website container..."
docker run -d -p 8080:80 --name lochness-website-container lochness-website

echo "Lochness website is now running at http://localhost:8080"
