output "amplify_app_id" {
  value       = module.portfolio.amplify_app_id
  description = "Amplify app id."
}

output "amplify_default_domain" {
  value       = module.portfolio.amplify_default_domain
  description = "Amplify default domain (CloudFront-managed)."
}

output "domain_association_id" {
  value       = module.portfolio.domain_association_id
  description = "Amplify domain association id."
}

output "cloudflare_dns_records" {
  value       = module.portfolio.cloudflare_dns_records
  description = "DNS records to create in Cloudflare."
}

output "certificate_verification_dns_record" {
  value       = module.portfolio.certificate_verification_dns_record
  description = "DNS record used by Amplify/ACM to verify the certificate (create in Cloudflare if present)."
}

output "cms_api_url" {
  value       = module.cms.api_url
  description = "Public CMS API URL."
}

output "cms_user_pool_id" {
  value       = module.cms.user_pool_id
  description = "Cognito user pool for admin auth."
}

output "cms_user_pool_client_id" {
  value       = module.cms.user_pool_client_id
  description = "Cognito app client for admin auth."
}
