# Lochness Group Website - AWS ECS Deployment

This Terraform configuration deploys the Lochness Group website to AWS ECS using Fargate.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (v1.0.0+)
- Docker installed

## Deployment Steps

1. Build and push the Docker image to ECR:

```bash
# Login to ECR
aws ecr get-login-password --region $(terraform output -raw aws_region) | docker login --username AWS --password-stdin $(terraform output -raw ecr_repository_url)

# Build the image
docker build -t lochness-website .

# Tag the image
docker tag lochness-website:latest $(terraform output -raw ecr_repository_url):latest

# Push the image
docker push $(terraform output -raw ecr_repository_url):latest
```

2. Initialize Terraform:

```bash
cd terraform
terraform init
```

3. Apply the Terraform configuration:

```bash
terraform apply
```

4. Access the website:

After deployment completes, you can access the website using the ALB DNS name:

```bash
echo "Website URL: http://$(terraform output -raw alb_dns_name)"
```

## Infrastructure Components

- ECR Repository: Stores the Docker image
- ECS Cluster: Manages the containerized application
- ECS Task Definition: Defines the container configuration
- ECS Service: Maintains the desired number of tasks
- VPC and Networking: Provides the network infrastructure
- Application Load Balancer: Distributes traffic to the containers
- Security Groups: Controls inbound and outbound traffic
- IAM Roles: Provides necessary permissions

## Cleanup

To destroy all resources created by Terraform:

```bash
terraform destroy
```
