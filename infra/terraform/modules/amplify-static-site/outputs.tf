output "amplify_app_id" {
  value       = aws_amplify_app.this.id
  description = "Amplify app id."
}

output "amplify_default_domain" {
  value       = aws_amplify_app.this.default_domain
  description = "Amplify default domain (CloudFront-managed)."
}

output "domain_association_id" {
  value       = aws_amplify_domain_association.this.id
  description = "Amplify domain association id."
}

output "certificate_verification_dns_record" {
  value       = aws_amplify_domain_association.this.certificate_verification_dns_record
  description = "Certificate verification DNS record (may be empty if already verified)."
}

locals {
  subdomains_by_prefix = { for sd in aws_amplify_domain_association.this.sub_domain : sd.prefix => sd }

  apex_dns_record_raw = try(local.subdomains_by_prefix[""].dns_record, "")
  www_dns_record_raw  = try(local.subdomains_by_prefix["www"].dns_record, "")

  # Amplify returns strings like:
  # - "CNAME dxxxx.cloudfront.net"
  # - "www CNAME dxxxx.cloudfront.net"
  # This extracts the last token as the target hostname.
  apex_target = (
    trimspace(local.apex_dns_record_raw) == "" ? null : reverse(split(" ", trimspace(local.apex_dns_record_raw)))[0]
  )
  www_target = (
    trimspace(local.www_dns_record_raw) == "" ? null : reverse(split(" ", trimspace(local.www_dns_record_raw)))[0]
  )
}

output "cloudflare_dns_records" {
  description = "DNS records to create in Cloudflare. Cloudflare supports CNAME flattening at apex."
  value = {
    apex = {
      name  = "@"
      type  = "CNAME"
      value = local.apex_target
    }
    www = {
      name  = "www"
      type  = "CNAME"
      value = local.www_target
    }
  }
}
