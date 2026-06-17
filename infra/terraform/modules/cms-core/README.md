# cms-core module

Creates the base CMS stack used by the portfolio revamp:
- S3 media bucket
- DynamoDB content table
- Cognito user pool, app client and admin group
- Lambda API with HTTP API Gateway

## Packaging note
The lambda zip is currently committed from `lambda/src/index.js` as `lambda/cms-api.zip`.
For production pipelines, replace this with deterministic packaging (`archive_file` or CI artifact) to avoid drift.
