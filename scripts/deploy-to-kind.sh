#!/bin/bash
set -e

echo "🚀 Deploying Lochness Website to Kind cluster 'higgs-cluster'..."

# Check prerequisites
if ! command -v kind &> /dev/null; then
    echo "❌ Kind is not installed."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    exit 1
fi

# Check if higgs-cluster exists
if ! kind get clusters | grep -q "higgs-cluster"; then
    echo "❌ Kind cluster 'higgs-cluster' not found."
    echo "Please ensure the cluster is created and running."
    exit 1
else
    echo "✅ Found Kind cluster 'higgs-cluster'"
fi

# Set kubectl context
echo "Adjusting kubectl context..."
kubectl config use-context kind-higgs-cluster

# Run unit tests
echo "🧪 Running unit tests..."
if ! npm test; then
    echo "❌ Tests failed. Aborting deployment."
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t lochness-website:latest .

# Load the image into Kind
echo "📦 Loading image into 'higgs-cluster'..."
kind load docker-image lochness-website:latest --name higgs-cluster

# Apply Kubernetes manifests
echo "🚢 Applying Kubernetes manifests..."
# These apply to the default namespace by default since no namespace is specified in the YAMLs
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Restart deployment to pick up new image
kubectl rollout restart deployment/lochness-website

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/lochness-website

echo "✅ Deployment complete!"
echo "Your application should be available at http://lochness.group:8888"
echo "  (Assuming port 30080 is mapped to 8888 in the higgs-cluster configuration)"
echo ""
echo "📊 Status: kubectl get pods"
echo "🔍 Logs:   kubectl logs -l app=lochness-website"
