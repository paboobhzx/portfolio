module "cms" {
  source = "../../modules/cms-core"

  name_prefix = var.app_name
  aws_region  = var.aws_region
}

module "portfolio" {
  source = "../../modules/amplify-static-site"

  app_name            = var.app_name
  branch_name         = var.branch_name
  github_repository   = var.github_repository
  github_token        = var.github_token
  domain_name         = var.domain_name
  enable_auto_build   = var.enable_auto_build
  enable_spa_rewrites = true
  custom_rules = [
    {
      source = "/project-map-cosmo"
      target = "/project-map-cosmo/index.html"
      status = "200"
    },
    {
      source = "/project-map-cosmo/<*>"
      target = "/project-map-cosmo/index.html"
      status = "200"
    },
    {
      source = "/project-map-superzap"
      target = "/project-map-superzap/index.html"
      status = "200"
    },
    {
      source = "/project-map-superzap/<*>"
      target = "/project-map-superzap/index.html"
      status = "200"
    },
    {
      source = "/project-map-superdoc"
      target = "/project-map-superdoc/index.html"
      status = "200"
    },
    {
      source = "/project-map-superdoc/<*>"
      target = "/project-map-superdoc/index.html"
      status = "200"
    },
    {
      source = "/project-map-kuiper"
      target = "/project-map-kuiper/index.html"
      status = "200"
    },
    {
      source = "/project-map-kuiper/<*>"
      target = "/project-map-kuiper/index.html"
      status = "200"
    }
  ]

  environment_variables = {
    NODE_VERSION              = "20"
    VITE_API_URL              = module.cms.api_url
    VITE_AWS_REGION           = var.aws_region
    VITE_COGNITO_USER_POOL_ID = module.cms.user_pool_id
    VITE_COGNITO_CLIENT_ID    = module.cms.user_pool_client_id
  }
}
