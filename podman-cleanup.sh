#!/bin/bash

echo "Deleting Kubernetes resources..."
kubectl delete -f k8s-deployment.yaml || true

echo "Deleting Kind cluster..."
kind delete cluster --name lochness-cluster

echo "Removing Podman image..."
podman rmi localhost/lochness-website:latest || true

echo "Cleanup complete!"
