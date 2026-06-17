variable "app_name" {
  type        = string
  description = "Amplify app name."
}

variable "branch_name" {
  type        = string
  description = "Branch name to build/deploy."
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
  description = "Custom domain apex (e.g. pablobhz.cloud)."
}

variable "enable_auto_build" {
  type        = bool
  description = "Whether Amplify should auto-build on commits."
  default     = true
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables for Amplify builds."
  default     = {}
}

variable "build_spec" {
  type        = string
  description = "Optional override for Amplify build spec YAML."
  default     = null
}

variable "enable_spa_rewrites" {
  type        = bool
  description = "Enable SPA rewrite rule (serve /index.html for most routes). Keep false for multi-page static sites."
  default     = false
}

variable "custom_rules" {
  type = list(object({
    source = string
    target = string
    status = string
  }))
  description = "Ordered custom Amplify rewrite/redirect rules applied before optional SPA fallback."
  default     = []
}
