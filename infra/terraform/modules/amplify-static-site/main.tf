locals {
  default_build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: dist
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
  EOT
}

resource "aws_amplify_app" "this" {
  name         = var.app_name
  repository   = var.github_repository
  access_token = var.github_token

  build_spec = coalesce(var.build_spec, local.default_build_spec)

  dynamic "custom_rule" {
    for_each = var.custom_rules
    content {
      source = custom_rule.value.source
      status = custom_rule.value.status
      target = custom_rule.value.target
    }
  }

  dynamic "custom_rule" {
    for_each = var.enable_spa_rewrites ? [1] : []
    content {
      # SPA rewrite: route everything without a file extension to /index.html
      source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>"
      status = "200"
      target = "/index.html"
    }
  }

  environment_variables = var.environment_variables

  tags = {
    ManagedBy = "terraform"
  }
}

resource "aws_amplify_branch" "this" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch_name

  enable_auto_build           = var.enable_auto_build
  enable_pull_request_preview = false

  environment_variables = var.environment_variables

  tags = {
    ManagedBy = "terraform"
  }
}

resource "aws_amplify_domain_association" "this" {
  app_id      = aws_amplify_app.this.id
  domain_name = var.domain_name

  # Do not block `terraform apply` waiting for DNS validation (Cloudflare records
  # are created manually). The domain will become VERIFIED once records propagate.
  wait_for_verification = false

  sub_domain {
    branch_name = aws_amplify_branch.this.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.this.branch_name
    prefix      = "www"
  }

  sub_domain {
    branch_name = aws_amplify_branch.this.branch_name
    prefix      = "portfolio"
  }
}
