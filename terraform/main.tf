provider "aws" {
  region = var.aws_region
}

# ECR Repository
resource "aws_ecr_repository" "lochness_repo" {
  name                 = "lochness-website"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "lochness_cluster" {
  name = "lochness-cluster"
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lochness_logs" {
  name              = "/ecs/lochness-website"
  retention_in_days = 30
}

# Task Definition
resource "aws_ecs_task_definition" "lochness_task" {
  family                   = "lochness-website"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name         = "lochness-website"
      image        = "${aws_ecr_repository.lochness_repo.repository_url}:latest"
      essential    = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.lochness_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "lochness-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# VPC and Networking
resource "aws_vpc" "lochness_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "lochness-vpc"
  }
}

resource "aws_subnet" "lochness_public_subnet_1" {
  vpc_id                  = aws_vpc.lochness_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "lochness-public-subnet-1"
  }
}

resource "aws_subnet" "lochness_public_subnet_2" {
  vpc_id                  = aws_vpc.lochness_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "lochness-public-subnet-2"
  }
}

resource "aws_internet_gateway" "lochness_igw" {
  vpc_id = aws_vpc.lochness_vpc.id

  tags = {
    Name = "lochness-igw"
  }
}

resource "aws_route_table" "lochness_public_rt" {
  vpc_id = aws_vpc.lochness_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lochness_igw.id
  }

  tags = {
    Name = "lochness-public-rt"
  }
}

resource "aws_route_table_association" "lochness_public_rta_1" {
  subnet_id      = aws_subnet.lochness_public_subnet_1.id
  route_table_id = aws_route_table.lochness_public_rt.id
}

resource "aws_route_table_association" "lochness_public_rta_2" {
  subnet_id      = aws_subnet.lochness_public_subnet_2.id
  route_table_id = aws_route_table.lochness_public_rt.id
}

# Security Group
resource "aws_security_group" "lochness_sg" {
  name        = "lochness-sg"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.lochness_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "lochness-sg"
  }
}

# ALB
resource "aws_lb" "lochness_alb" {
  name               = "lochness-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lochness_sg.id]
  subnets            = [aws_subnet.lochness_public_subnet_1.id, aws_subnet.lochness_public_subnet_2.id]

  tags = {
    Name = "lochness-alb"
  }
}

resource "aws_lb_target_group" "lochness_tg" {
  name        = "lochness-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.lochness_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

resource "aws_lb_listener" "lochness_listener" {
  load_balancer_arn = aws_lb.lochness_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lochness_tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "lochness_service" {
  name            = "lochness-service"
  cluster         = aws_ecs_cluster.lochness_cluster.id
  task_definition = aws_ecs_task_definition.lochness_task.arn
  desired_count   = var.service_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.lochness_public_subnet_1.id, aws_subnet.lochness_public_subnet_2.id]
    security_groups  = [aws_security_group.lochness_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.lochness_tg.arn
    container_name   = "lochness-website"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.lochness_listener]
}

# Output the AWS region for use in deployment scripts
output "aws_region" {
  value = var.aws_region
}
