#!/bin/bash
set -e

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "kind is not installed. Please install it first: https://kind.sigs.k8s.io/docs/user/quick-start/#installation"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install it first: https://kubernetes.io/docs/tasks/tools/install-kubectl/"
    exit 1
fi

# Create a kind cluster
echo "Creating kind cluster..."
kind create cluster --name lochness-website

# Set kubectl context to kind
kubectl cluster-info --context kind-lochness-website

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

echo "Kind cluster setup complete!"
echo "You can access the application by port-forwarding:"
echo "kubectl port-forward svc/lochness-website 8081:80"
