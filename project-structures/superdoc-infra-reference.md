# SuperDoc — Infrastructure Reference

> **Gerado em:** 2026-05-20  
> **Região AWS:** `us-east-1`  
> **Conta AWS:** `288854271409`  
> **Domínio:** `superdoc.pablobhz.cloud`  
> **IaC:** Terraform `>= 1.7.0` · Provider AWS `~> 5.0` · Provider Random `~> 3.5`  
> **State backend:** S3 `superdoc-tfstate` (criptografado, versioning habilitado, lock via `use_lockfile`)

---

## 1. Visão Geral

```
Internet
    │
    ▼
Route53 (A alias)
    │
    ▼
CloudFront (E1NJJUEZ141IMN)
    ├── /* → Amplify (d2ibg69ss24krr)   [frontend React/Vite]
    └── /api/* → API Gateway (g590x2ydn4)  [REST Regional]
                        │
              ┌─────────┼──────────────────────────┐
              │         │                          │
           Lambda    Lambda                     Lambda
         (handlers)  (workers)               (scheduled)
              │         │                          │
           DynamoDB    SQS → dispatch → worker    EventBridge
              │         │
              S3 (media bucket)
```

---

## 2. Networking & DNS

### Route53
- **Zona:** `pablobhz.cloud` (Zone ID `Z00715662A3EPIVLR1LS`)
- **Record:** `superdoc.pablobhz.cloud` → A alias para CloudFront
- **SES DKIM CNAMEs:** 3 registros `*._domainkey.pablobhz.cloud` → `*.dkim.amazonses.com`

### ACM
- **Certificado:** `superdoc.pablobhz.cloud` — validação via DNS (Route53 automático)

### CloudFront
- **Distribution ID:** `E1NJJUEZ141IMN`
- **Origins:**
  - Frontend: Amplify (`main.<amplify-default-domain>`)
  - API: API Gateway invoke URL (path `/api/*`)
- **Cache:** invalidação obrigatória após cada deploy de frontend

---

## 3. Frontend

### AWS Amplify
- **App ID:** `d2ibg69ss24krr`
- **Modo:** Deploy manual (zip upload via `create-deployment` + `start-deployment`)
- **Build spec:** `cd frontend && npm ci && npm run build` → `frontend/dist`
- **Env vars injetadas:**
  - `VITE_API_URL` — `/api` em prod
  - `VITE_ENV`
  - `VITE_COGNITO_USER_POOL_ID`
  - `VITE_COGNITO_CLIENT_ID`
- **Custom rule:** `/<*>` → `index.html` (SPA fallback)
- **Nota:** NÃO é Git-connected. Auto-build está configurado na branch `main`, mas deploys são manuais + CloudFront invalidation.

---

## 4. API Gateway

- **ID:** `g590x2ydn4`
- **Nome:** `superdoc-prod-api`
- **Tipo:** REST Regional
- **Authorizer:** Cognito User Pools (`COGNITO_USER_POOLS`) — usado nas rotas `/admin/*`
- **CORS:** habilitado via `DEFAULT_4XX`, `DEFAULT_5XX`, e OPTIONS/MOCK em cada recurso
- **Rate limit response 429:** JSON com `register_url`

### Rotas

| Método | Caminho | Lambda integrada | Auth |
|--------|---------|-----------------|------|
| POST | `/jobs` | `create-job` | NONE |
| GET | `/jobs/{jobId}` | `get-status` | NONE |
| POST | `/jobs/{jobId}/process` | `process-job` | NONE |
| GET | `/jobs/{jobId}/download` | `presign-download` | NONE |
| GET | `/operations` | `list-operations` | NONE |
| POST | `/auth/login` | `auth-session` | NONE |
| GET | `/auth/me` | `auth-session` | NONE |
| POST | `/auth/logout` | `auth-session` | NONE |
| GET | `/users/me/files` | `user-files` | NONE |
| POST | `/users/me/files` | `user-create-file` | NONE |
| POST | `/users/me/files/{fileId}/complete` | `user-complete-file` | NONE |
| GET | `/users/me/credits` | `user-credits` | NONE |
| GET | `/users/me/settings` | `user-settings` | NONE |
| PUT | `/users/me/settings` | `user-settings` | NONE |
| GET | `/admin/flags` | `admin-flags` | COGNITO |
| POST | `/admin/flags` | `admin-flags` | COGNITO |
| GET | `/admin/incidents` | `admin-incidents` | COGNITO |
| POST | `/admin/incidents` | `admin-incidents` | COGNITO |
| POST | `/billing/checkout/credits` | `billing-create-checkout` | NONE |
| POST | `/stripe/webhook` | `stripe-webhook` | NONE |
| POST | `/stripe/checkout` | `stripe-create-checkout` | NONE |
| GET | `/jobs/{jobId}/analyze` | `pdf-analyze` | NONE |
| POST | `/jobs/{jobId}/repair` | `pdf-repair` | NONE |
| GET | `/health` | MOCK `{"status":"ok"}` | NONE |

---

## 5. Lambdas

**Runtime padrão:** Python 3.12  
**Layers:** `superdoc-utils` + `python-deps` (zips no S3 `superdoc-lambda-zips-288854271409`)  
**IAM por função:** role própria com `AWSLambdaBasicExecutionRole` + políticas scoped para DynamoDB, S3, SSM  
**Logs:** CloudWatch `/aws/lambda/<name>` — retention 7 dias — nível `WARNING` em prod  
**Tracing:** `PassThrough`  

### 5.1 Handlers de API (core)

| Função | Memória | Timeout | Notas |
|--------|---------|---------|-------|
| `superdoc-prod-create-job` | 128 MB | 30s | Valida `file_size_bytes > 0`, emite presign POST |
| `superdoc-prod-get-status` | 128 MB | 10s | Polling de status do job |
| `superdoc-prod-process-job` | 128 MB | 30s | Enfileira no SQS; IAM extra: `sqs:SendMessage` |
| `superdoc-prod-presign-download` | 128 MB | 5s | Gera URL de download temporária |
| `superdoc-prod-list-operations` | 128 MB | 5s | Retorna catálogo de operações disponíveis |
| `superdoc-prod-auth-session` | 128 MB | 10s | Login/logout/me via Cognito |
| `superdoc-prod-user-files` | 128 MB | 10s | Lista arquivos do usuário |
| `superdoc-prod-user-create-file` | 128 MB | 20s | Cria arquivo de usuário |
| `superdoc-prod-user-complete-file` | 128 MB | 10s | Finaliza upload de arquivo |
| `superdoc-prod-user-settings` | 128 MB | 10s | GET/PUT de preferências do usuário |
| `superdoc-prod-user-credits` | 128 MB | 10s | Consulta saldo de créditos |

### 5.2 Workers PDF (tagged `superdoc:role=worker`)

| Função | Memória | Timeout | Package | Notas |
|--------|---------|---------|---------|-------|
| `superdoc-prod-pdf-to-docx` | 2048 MB | 300s | **Image** (arm64) | LibreOffice; fallback Zip em modo não-Image |
| `superdoc-prod-pdf-to-docx-fast` | 512 MB | 60s | Zip | pdf2docx path rápido |
| `superdoc-prod-pdf-merge` | 512 MB | 300s | Zip | |
| `superdoc-prod-pdf-split` | 256 MB | 120s | Zip | |
| `superdoc-prod-pdf-compress` | 512 MB | 300s | Zip | |
| `superdoc-prod-pdf-rotate` | 256 MB | 120s | Zip | |
| `superdoc-prod-pdf-annotate` | 256 MB | 120s | Zip | |
| `superdoc-prod-pdf-rearrange` | 256 MB | 120s | Zip | |
| `superdoc-prod-pdf-svg-annotate` | 512 MB | 180s | Zip | |
| `superdoc-prod-pdf-remove-watermark` | 512 MB | 180s | Zip | |
| `superdoc-prod-pdf-extract-text` | 256 MB | 120s | Zip | |
| `superdoc-prod-pdf-to-image` | 1024 MB | 120s | Zip | |
| `superdoc-prod-pdf-to-txt` | 256 MB | 120s | Zip | IAM extra: `textract:DetectDocumentText` |
| `superdoc-prod-pdf-to-xls` | 512 MB | 120s | Zip | |
| `superdoc-prod-pdf-analyze` | 512 MB | 30s | Zip | Análise de complexidade (Plan 12) |
| `superdoc-prod-pdf-repair` | 512 MB | 60s | Zip | Reparo de PDF corrompido (Plan 12) |

### 5.3 Workers DOCX/XLSX (tagged `superdoc:role=worker`)

| Função | Memória | Timeout | Package | Notas |
|--------|---------|---------|---------|-------|
| `superdoc-prod-docx-to-pdf` | 2048 MB | 300s | **Image** (arm64) | LibreOffice |
| `superdoc-prod-docx-to-pdf-fast` | 512 MB | 60s | Zip | |
| `superdoc-prod-docx-to-txt` | 256 MB | 60s | Zip | |
| `superdoc-prod-xlsx-to-pdf` | 2048 MB | 300s | **Image** (arm64) | LibreOffice |
| `superdoc-prod-xlsx-to-pdf-fast` | 512 MB | 60s | Zip | |
| `superdoc-prod-xlsx-to-csv` | 512 MB | 120s | Zip | |

### 5.4 Workers Markdown / HTML / Doc / Image (tagged `superdoc:role=worker`)

| Função | Memória | Timeout | Notas |
|--------|---------|---------|-------|
| `superdoc-prod-markdown-convert` | 512 MB | 120s | |
| `superdoc-prod-html-convert` | 512 MB | 120s | |
| `superdoc-prod-doc-edit` | 256 MB | 120s | |
| `superdoc-prod-image-to-pdf` | 256 MB | 60s | |
| `superdoc-prod-image-convert` | 256 MB | 120s | IAM extra: `textract:DetectDocumentText` |

### 5.5 Worker Video (tagged `superdoc:role=worker`)

| Função | Memória | Timeout | Notas |
|--------|---------|---------|-------|
| `superdoc-prod-video-process` | 1024 MB | 900s | IAM extra: Transcribe + Translate; concorrência ilimitada |

### 5.6 Dispatcher SQS

| Função | Memória | Timeout | Notas |
|--------|---------|---------|-------|
| `superdoc-prod-dispatch-job` | 128 MB | 30s | ESM no SQS `batch_size=1`; invoca workers via `lambda:InvokeFunction` com `Condition: aws:ResourceTag/superdoc:role = worker` |

### 5.7 Scheduled / Proteção

| Função | Memória | Timeout | Trigger | Notas |
|--------|---------|---------|---------|-------|
| `superdoc-prod-sweeper-expired-files` | 128 MB | 300s | EventBridge `rate(15 minutes)` | Limpeza de jobs expirados |
| `superdoc-prod-disable-anonymous` | 128 MB | 60s | SNS `auto-disable` | Desabilita acesso anônimo quando billing > $20; IAM extra: SNS Publish, API GW PATCH, EventBridge, CloudWatch Logs |
| `superdoc-prod-restore-anonymous` | 128 MB | 30s | — | Restaura acesso anônimo; IAM extra: API GW PATCH |

### 5.8 Billing / Admin

| Função | Memória | Timeout | Notas |
|--------|---------|---------|-------|
| `superdoc-prod-stripe-webhook` | 256 MB | 10s | Env extra: `PAYMENTS_TABLE_NAME` |
| `superdoc-prod-stripe-create-checkout` | 256 MB | 10s | Env extra: `PAYMENTS_TABLE_NAME` |
| `superdoc-prod-billing-create-checkout` | 128 MB | 10s | |
| `superdoc-prod-admin-flags` | 128 MB | 10s | Auth: Cognito |
| `superdoc-prod-admin-incidents` | 128 MB | 10s | Auth: Cognito |

### 5.9 Lambda Layers

| Layer | S3 Key | Runtime |
|-------|--------|---------|
| `superdoc-prod-superdoc-utils` | `layers/superdoc_utils.zip` | python3.12 |
| `superdoc-prod-python-deps` | `layers/python_deps.zip` | python3.12 |

> **Atenção:** qualquer mudança em `layers/superdoc_utils/*.py` exige rebuild do layer + `terraform apply`.

### 5.10 ECR (modo Image)

- **Repositório:** `superdoc-prod-office-conversion`
- **Images (tags):**
  - `docx_to_pdf-<tag>` → lambda `docx-to-pdf`
  - `xlsx_to_pdf-<tag>` → lambda `xlsx-to-pdf`
  - `pdf_to_docx-<tag>` → lambda `pdf-to-docx`
- **Scan on push:** habilitado

---

## 6. Mensageria — SQS

| Fila | Retention | Visibility Timeout | Notas |
|------|-----------|-------------------|-------|
| `superdoc-prod-jobs` | 4h | 900s (= max Lambda timeout) | Fila principal; redrive → DLQ após 3 tentativas |
| `superdoc-prod-jobs-dlq` | 14 dias | — | Dead Letter Queue; alarme CloudWatch se > 0 mensagens |

---

## 7. Storage

### S3

#### Media Bucket (`superdoc-prod-media-<hex>`)
- **Acesso:** completamente privado (public access block total)
- **Criptografia:** AES256 por padrão; KMS customer-managed opcional (`enable_media_customer_managed_kms`)
- **Versionamento:** desabilitado
- **CORS:** `GET, PUT, POST` de `https://superdoc.pablobhz.cloud`, `localhost:5173`, `localhost:4173`
- **Lifecycle (expiração automática):**

| Prefixo | Expiração |
|---------|-----------|
| `uploads/` | 1 dia |
| `outputs/` | 1 dia |
| `users/` | 7 dias |
| `tmp/` | 1 dia |

#### Lambda Zips Bucket
- **Nome:** `superdoc-lambda-zips-288854271409`
- **Uso:** CI do repo privado faz upload de handlers e layers aqui; Terraform lê

#### Terraform State Bucket
- **Nome:** `superdoc-tfstate`
- **Configuração:** versioning, AES256, public access block, `prevent_destroy = true`

---

## 8. DynamoDB

Todas as tabelas: **PAY_PER_REQUEST** (on-demand). KMS customer-managed opcional (`enable_dynamodb_customer_managed_kms`).

| Tabela | Hash Key | Sort Key | GSIs | TTL | Notas |
|--------|----------|----------|------|-----|-------|
| `superdoc-prod-jobs` | `job_id` (S) | — | `session-index` (session_id/status), `user-history-index` (user_id/created_at) | `expires_at` | Tabela principal de jobs |
| `superdoc-prod-api-keys` | `key_hash` (S) | — | `user-keys-index` (user_id) | `expires_at` | |
| `superdoc-prod-incidents` | `incident_id` (S) | `timestamp` (S) | `status-index` (status/timestamp) | `expires_at` | |
| `superdoc-prod-rate-limits` | `key` (S) | — | — | `expires_at` | |
| `superdoc-prod-auth-sessions` | `session_id_hash` (S) | — | — | `expires_at` | |
| `superdoc-prod-payments` | `payment_id` (S) | — | — | `ttl` | Checkouts abandonados: TTL 24h |
| `superdoc-prod-credits-ledger` | `event_id` (S) | — | `user-created-at-index` (user_id/created_at N) | — | |
| `superdoc-prod-credits-balances` | `user_id` (S) | — | — | — | |
| `superdoc-prod-user-settings` | `user_id` (S) | — | — | — | |

---

## 9. Autenticação — Cognito

- **User Pool:** `superdoc-prod` (email como username, verificação via email SES `noreply@pablobhz.cloud`)
- **Client:** `superdoc-web` — `ALLOW_USER_PASSWORD_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_USER_SRP_AUTH`
- **Token validity:** access/id = 60 min, refresh = 30 dias
- **Token revocation:** habilitado
- **SES:** DKIM habilitado via 3 CNAMEs no Route53

---

## 10. SSM Parameter Store

### Feature Flags (`String`)

| Parâmetro | Default |
|-----------|---------|
| `/superdoc/features/anonymous_ops_enabled` | `"true"` |
| `/superdoc/features/maintenance_mode` | `"false"` |
| `/superdoc/features/registrations_enabled` | `"true"` |
| `/superdoc/features/video_processing_enabled` | `"true"` |

### Secrets (`SecureString`)

| Parâmetro | Uso |
|-----------|-----|
| `/superdoc/stripe/secret_key` | Stripe SK |
| `/superdoc/stripe/webhook_secret` | Stripe webhook |
| `/superdoc/stripe/price_id_conversion` | Price ID por conversão |
| `/superdoc/stripe/price_id_credits` | Price ID pack de créditos |
| `/superdoc/bedrock/knowledge_base_id` | Bedrock KB (futuro) |

> Todos com `lifecycle { ignore_changes = [value] }` — valores reais setados fora do Terraform.

---

## 11. Monitoring & Alertas

### SNS Topics

| Tópico | Uso |
|--------|-----|
| `superdoc-prod-alerts` | Alertas gerais → email `pablobhz@gmail.com` |
| `superdoc-prod-auto-disable` | Trigger para `disable-anonymous` Lambda quando billing > $20 |

### CloudWatch Alarms

| Alarme | Threshold | Ação |
|--------|-----------|------|
| `billing-10usd-warn` | Estimated charges > $10 | SNS alerts |
| `billing-20usd-disable` | Estimated charges > $20 | SNS alerts + SNS auto-disable |
| `s3-puts-high` | PutRequests > 2000/hr | SNS alerts |
| `api-4xx-high` | 4XX errors > 500 em 5min | SNS alerts |
| `dlq-not-empty` | DLQ messages > 0 em 5min | SNS alerts |

### Budget
- Módulo `budget` separado (alerta de custo AWS Budgets)

### Office Lambda Warmer
- EventBridge `rate(4 minutes)` pinga `docx-to-pdf`, `xlsx-to-pdf`, `pdf-to-docx`
- Ativo somente quando `office_converter_package_type == "Image"`
- Input: `{"_warmup": true}`

---

## 12. Variáveis de Ambiente Globais das Lambdas

Todas as Lambdas recebem `lambda_common_env`:

| Variável | Valor em Prod |
|----------|--------------|
| `RATE_LIMIT_ENABLED` | `"false"` |
| `JOBS_TABLE` | `superdoc-prod-jobs` |
| `API_KEYS_TABLE` | `superdoc-prod-api-keys` |
| `INCIDENTS_TABLE` | `superdoc-prod-incidents` |
| `RATE_LIMITS_TABLE` | `superdoc-prod-rate-limits` |
| `AUTH_SESSIONS_TABLE` | `superdoc-prod-auth-sessions` |
| `MEDIA_BUCKET` | `superdoc-prod-media-<hex>` |
| `CORS_ALLOW_ORIGIN` | `https://superdoc.pablobhz.cloud` |
| `SQS_QUEUE_URL` | URL da fila `superdoc-prod-jobs` |
| `ENVIRONMENT` | `prod` |
| `COGNITO_CLIENT_ID` | Client ID do User Pool |
| `LOG_LEVEL` | `WARNING` |
| `ANON_DAILY_CONVERSION_LIMIT` | `3` |
| `USER_DAILY_CONVERSION_LIMIT` | `10` |
| `ANON_PDF_PAGE_LIMIT` | `100` |
| `USER_PDF_PAGE_LIMIT` | `300` |
| `DEFAULT_TTL_SECONDS` | `900` (15 min) |
| `TTL_SECONDS` | `43200` (12h) |
| `USER_TTL_SECONDS` | `64800` (18h) |
| `PAYMENTS_TABLE_NAME` | `superdoc-prod-payments` |
| `CREDITS_LEDGER_TABLE` | `superdoc-prod-credits-ledger` |
| `CREDITS_BALANCES_TABLE` | `superdoc-prod-credits-balances` |
| `CREDITS_TIER_200/500/1000/5000` | `2/5/10/50` |
| `REGISTERED_FREE_MULTIMEDIA_DAILY_LIMIT` | `1` |
| `USER_SETTINGS_TABLE` | `superdoc-prod-user-settings` |

---

## 13. IAM — Modelo de Permissão

Cada Lambda tem uma role dedicada `superdoc-prod-<nome>-role` com:

- `AWSLambdaBasicExecutionRole` (logs CloudWatch)
- Policy scoped DynamoDB: `GetItem, PutItem, UpdateItem, Query, Scan, DeleteItem` nos ARNs listados
- Policy scoped S3: `GetObject, PutObject, DeleteObject` em `uploads/`, `outputs/`, `users/`, `tmp/`, `incidents/`
- Policy SSM: `GetParameter, GetParameters, PutParameter` em `arn:aws:ssm:*:*:parameter/superdoc/*`
- Políticas extras por função (ex: SQS, Cognito, Textract, Transcribe, Translate, SNS, API GW)

**Dispatcher:** `lambda:InvokeFunction` com `Condition: StringEquals: aws:ResourceTag/superdoc:role = worker` — evita enumerar ARNs de workers individualmente.

---

## 14. CI/CD & Deploy

| Componente | Mecanismo |
|-----------|-----------|
| Terraform state | S3 `superdoc-tfstate` + lock nativo S3 |
| Lambda zips | CI do repo privado → S3 `superdoc-lambda-zips-288854271409` |
| GitHub Actions | OIDC |
| Frontend | `npm run build` local → zip → Amplify `create-deployment` / `start-deployment` → CloudFront invalidation |
| apply.sh | Injeta `TF_VAR_amplify_oauth_token` via SSM antes do apply |

---

## 15. Pagamentos (Stripe — Dormant)

Scaffolding completo deployado, não ativado:

- SSM params com keys/price IDs (`REPLACE_ME` / `PLACEHOLDER`)
- Lambdas `stripe-webhook`, `stripe-create-checkout`, `billing-create-checkout`
- Tabelas `payments`, `credits-ledger`, `credits-balances`
- Rotas `/stripe/*` e `/billing/checkout/credits` no API GW
- Modelo de negócio planejado: `$0.50` flat por conversão, mínimo 3 créditos
