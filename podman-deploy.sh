#!/bin/bash

# Exit on error
set -e

echo "Checking if Podman is installed..."
if ! command -v podman &> /dev/null; then
    echo "Podman is not installed. Please install Podman first."
    echo "On macOS: brew install podman"
    echo "On Linux: sudo apt-get install -y podman (Ubuntu/Debian) or sudo dnf install -y podman (Fedora)"
    exit 1
fi

echo "Checking if Kind is installed..."
if ! command -v kind &> /dev/null; then
    echo "Kind is not installed. Please install Kind first."
    echo "On macOS: brew install kind"
    echo "On Linux: curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64 && chmod +x ./kind && sudo mv ./kind /usr/local/bin/"
    exit 1
fi

echo "Checking if kubectl is installed..."
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install kubectl first."
    echo "On macOS: brew install kubectl"
    echo "On Linux: sudo apt-get install -y kubectl (Ubuntu/Debian) or sudo dnf install -y kubectl (Fedora)"
    exit 1
fi

echo "Starting Podman machine if not running..."
if ! podman machine list | grep -q "Currently running"; then
    podman machine init
    podman machine start
fi

echo "Creating Kind cluster..."
kind create cluster --config kind-config.yaml

echo "Building Lochness website container with Podman..."
podman build -t localhost/lochness-website:latest .

echo "Saving the image to a tarball..."
podman save localhost/lochness-website:latest -o lochness-website.tar

echo "Loading the image into Kind..."
kind load image-archive lochness-website.tar --name lochness-cluster

echo "Deploying to Kubernetes..."
kubectl apply -f k8s-deployment.yaml

echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/lochness-website

echo "Lochness website is now running!"
echo "Access it at http://localhost:8080"

# Clean up the tarball
rm lochness-website.tar
