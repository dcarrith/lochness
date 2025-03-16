#!/bin/bash

# Don't exit on error, handle errors gracefully
set +e

# Print script execution steps
set -x

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

echo "Ensuring Podman machine is running..."
if ! podman machine list | grep -q "Currently running"; then
    echo "Podman machine is not running. Starting it now..."
    # Check if machine exists first
    if podman machine list | grep -q "podman-machine-default"; then
        podman machine start
    else
        echo "Initializing new Podman machine..."
        podman machine init --cpus 2 --memory 4096
        podman machine start
    fi
    
    # Wait for machine to be fully ready
    echo "Waiting for Podman machine to be ready..."
    sleep 15
fi

# Verify Podman connection
echo "Verifying Podman connection..."
if ! podman info &> /dev/null; then
    echo "Cannot connect to Podman. Trying to restart the machine..."
    podman machine stop || true
    podman machine start
    sleep 15
    
    if ! podman info &> /dev/null; then
        echo "Still cannot connect to Podman. Please check your Podman installation."
        exit 1
    fi
fi

echo "Creating Kind cluster..."
# Delete existing cluster if it exists
kind delete cluster --name lochness-cluster 2>/dev/null || true
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
# Increase timeout and add retries
for i in {1..10}; do
    echo "Checking deployment status (attempt $i)..."
    if kubectl wait --for=condition=available --timeout=180s deployment/lochness-website; then
        echo "Deployment is ready!"
        break
    fi
    
    if [ $i -eq 10 ]; then
        echo "Deployment not ready after 10 attempts. Please check the logs:"
        kubectl get pods
        kubectl describe deployment lochness-website
        kubectl logs -l app=lochness-website --tail=50
    else
        echo "Deployment not ready yet, waiting 15 seconds before retrying..."
        sleep 15
    fi
done

# Check if service is exposed properly
echo "Verifying service exposure..."
kubectl get services -o wide

echo "Lochness website is now running!"
echo "Access it at http://localhost:8080"
echo "To check pod status: kubectl get pods"
echo "To view logs: kubectl logs -l app=lochness-website"

# Clean up the tarball
rm lochness-website.tar
