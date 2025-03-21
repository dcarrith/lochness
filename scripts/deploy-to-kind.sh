#!/bin/bash
set -e

echo "🚀 Deploying Lochness Website to Kind Kubernetes cluster..."

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "❌ Kind is not installed. Please install it first: https://kind.sigs.k8s.io/docs/user/quick-start/"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Create Kind cluster if it doesn't exist
if ! kind get clusters | grep -q "lochness-cluster"; then
    echo "🔧 Creating Kind cluster 'lochness-cluster'..."
    kind create cluster --config kind-config.yaml
else
    echo "✅ Kind cluster 'lochness-cluster' already exists"
fi

# Create k8s directory if it doesn't exist
mkdir -p k8s

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t lochness-website:latest .

# Load the image into Kind
echo "📦 Loading image into Kind cluster..."
kind load docker-image lochness-website:latest --name lochness-cluster

# Apply Kubernetes manifests
echo "🚢 Applying Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/lochness-website

echo "✅ Deployment complete! Your application should be available at http://localhost:8080"
echo "📊 To check the status of your deployment, run: kubectl get pods"
echo "🔍 To view logs, run: kubectl logs -l app=lochness-website"
echo "🗑️  To delete the deployment, run: kubectl delete -f k8s/"
echo "🗑️  To delete the cluster, run: kind delete cluster --name lochness-cluster"
