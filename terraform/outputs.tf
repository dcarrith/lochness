output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = aws_ecr_repository.lochness_repo.repository_url
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.lochness_alb.dns_name
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.lochness_cluster.name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.lochness_service.name
}
