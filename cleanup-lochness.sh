#!/bin/bash

echo "Cleaning up Lochness deployment..."

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "Error: kind is not installed or not in PATH"
    exit 1
fi

# Check if the cluster exists
if ! kind get clusters | grep -q "lochness-cluster"; then
    echo "Lochness cluster not found. Nothing to clean up."
    exit 0
fi

echo "Deleting Kind cluster..."
kind delete cluster --name lochness-cluster

echo "Checking for leftover Podman images..."
if command -v podman &> /dev/null; then
    # Check if podman machine is running
    if podman machine list 2>/dev/null | grep -q "Currently running"; then
        if podman images 2>/dev/null | grep -q "lochness-website"; then
            echo "Removing Podman images..."
            podman rmi localhost/lochness-website:latest -f || true
        fi
        
        # Remove any dangling images
        echo "Removing dangling images..."
        podman image prune -f || true
    else
        echo "Podman machine is not running, skipping image cleanup"
    fi
fi

# Check for leftover tarball
if [ -f "lochness-website.tar" ]; then
    echo "Removing image tarball..."
    rm lochness-website.tar
fi

echo "Cleanup complete!"
