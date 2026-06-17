# Terraform — Amplify Hosting (Portfolio)

This Terraform layout creates an AWS Amplify Hosting app (which includes managed CloudFront) for a static portfolio site, and associates a custom domain.

## What It Creates

- Amplify App (connected to a GitHub repo)
- Amplify Branch (default: `main`)
- Amplify Domain Association for:
  - `pablobhz.cloud` (apex)
  - `www.pablobhz.cloud`

## Security Note (GitHub Token)

`aws_amplify_app.access_token` is stored in Terraform state. Treat your state as sensitive:

- Do not commit state files.
- Prefer encrypted remote state (S3 + SSE) or Terraform Cloud.
- Use a dedicated GitHub PAT with the minimum needed scopes for Amplify to read the repo.

If you want a zero-token-in-state approach, you'll need a different integration path (manual GitHub app connection in Amplify console, or a custom provisioner) which is not included in this baseline.

## Prereqs

- Terraform >= 1.5
- AWS credentials configured (env vars, `~/.aws/credentials`, or SSO)
- A GitHub PAT to let Amplify pull the private repo
- DNS for `pablobhz.cloud` is managed in Cloudflare (you will add the records there)

## How To Apply (prod)

From `infra/terraform/environments/prod`:

```bash
terraform init
terraform plan \
  -var 'github_token=***' \
  -var 'github_repository=https://github.com/paboobhzx/pablobhz-portfolio' \
  -var 'domain_name=pablobhz.cloud'
terraform apply
```

### Passing the GitHub token safely

Prefer environment variables (so you don't leave it in your shell history):

```bash
export TF_VAR_github_token='...'
```

## Cloudflare DNS

After apply, Terraform will print outputs with the DNS records you must create in Cloudflare.

Cloudflare supports CNAME flattening at the apex, so it can point `pablobhz.cloud` to the Amplify target.

## Build/Deploy (Amplify)

This Terraform does not enforce your build system, but expects Amplify to publish from `dist/`.

Recommended: commit an `amplify.yml` at the repo root that runs:
- `npm ci`
- `npm run build`
and publishes `dist/` as artifacts.

## Notes on `/projects`

If you want `https://pablobhz.cloud/projects` to work, generate `dist/projects/index.html` during build.
Do not rely on SPA rewrites unless you're intentionally making the portfolio a single-page app.

