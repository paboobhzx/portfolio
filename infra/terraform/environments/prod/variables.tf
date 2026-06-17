variable "aws_region" {
  type        = string
  description = "AWS region to create the Amplify app in."
  default     = "us-east-1"
}

variable "app_name" {
  type        = string
  description = "Amplify app name."
  default     = "pablobhz-portfolio"
}

variable "branch_name" {
  type        = string
  description = "Git branch to build/deploy in Amplify."
  default     = "main"
}

variable "github_repository" {
  type        = string
  description = "GitHub repository URL (HTTPS)."
}

variable "github_token" {
  type        = string
  description = "GitHub PAT used by Amplify to access the repo."
  sensitive   = true
}

variable "domain_name" {
  type        = string
  description = "Custom domain (apex) for the portfolio."
  default     = "pablobhz.cloud"
}

variable "enable_auto_build" {
  type        = bool
  description = "Whether Amplify should auto-build on commits to the branch."
  default     = true
}

