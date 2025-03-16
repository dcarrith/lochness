#!/bin/bash

echo "Deleting Kubernetes resources..."
kubectl delete -f k8s-deployment.yaml 2>/dev/null || true
echo "Waiting for resources to be deleted..."
sleep 5

echo "Deleting Kind cluster..."
kind delete cluster --name lochness-cluster 2>/dev/null || true

echo "Checking Podman connection..."
if podman info &> /dev/null; then
    echo "Removing Podman image..."
    podman rmi localhost/lochness-website:latest 2>/dev/null || true
else
    echo "Cannot connect to Podman. Trying to restart the machine..."
    podman machine stop 2>/dev/null || true
    podman machine start
    sleep 5
    
    if podman info &> /dev/null; then
        echo "Removing Podman image..."
        podman rmi localhost/lochness-website:latest 2>/dev/null || true
    else
        echo "Still cannot connect to Podman. Skipping image removal."
    fi
fi

echo "Cleanup complete!"
