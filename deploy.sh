#!/bin/bash

# Exit on error
set -e

# Change to the terraform directory
cd terraform

# Initialize Terraform
terraform init

# Apply Terraform configuration
terraform apply -auto-approve

# Get ECR repository URL and AWS region
ECR_REPO=$(terraform output -raw ecr_repository_url)
AWS_REGION=$(terraform output -raw aws_region)

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

# Build the Docker image
cd ..
docker build -t lochness-website .

# Tag the image
docker tag lochness-website:latest $ECR_REPO:latest

# Push the image to ECR
docker push $ECR_REPO:latest

# Output the ALB DNS name
cd terraform
echo "Website URL: http://$(terraform output -raw alb_dns_name)"
