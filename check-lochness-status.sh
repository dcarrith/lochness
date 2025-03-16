#!/bin/bash

echo "Checking Lochness deployment status..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed or not in PATH"
    exit 1
fi

# Check if the cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster"
    echo "Make sure your cluster is running with: kind get clusters"
    exit 1
fi

echo "Pod status:"
kubectl get pods -o wide

echo "Service status:"
kubectl get services -o wide

echo "Deployment status:"
kubectl get deployments -o wide

echo "To access the application, visit: http://localhost:8080"
echo "To view logs: kubectl logs -l app=lochness-website"
