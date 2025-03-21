#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    echo "Visit https://docs.docker.com/get-docker/ for installation instructions."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building Lochness website container..."
docker build -t lochness-website:latest .

echo "Stopping any existing container..."
docker stop lochness-container 2>/dev/null || true
docker rm lochness-container 2>/dev/null || true

echo "Starting Lochness website container..."
docker run -d -p 8888:80 --name lochness-container lochness-website:latest

echo "Lochness website is now running!"
echo "Access it at http://localhost:8888"
