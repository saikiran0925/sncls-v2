variable "aws_region" {
  description = "The AWS region for resources (e.g. S3)"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "The domain name registered on Namecheap (e.g. sncls.com)"
  type        = string
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "sncls"
}

variable "environment" {
  description = "Environment stage (e.g. prod, dev)"
  type        = string
  default     = "prod"
}
