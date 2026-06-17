# COSMOFIT — Infrastructure Dump
**Gerado em:** 20/05/2026  
**Região AWS:** us-east-1  
**Gerenciado por:** Terraform  
**Root domain:** pablobhz.cloud  

---

## Visão Geral da Arquitetura

```
GitHub (main)
    │
    ▼
AWS Amplify ──────────────── cosmo.pablobhz.cloud / cosmofit.com.br
    │
    ▼
API Gateway (HTTP) ──────── api.pablobhz.cloud
    │
    ├── Main API (compute module)
    └── Admin API (auth module)
            │
            ▼
        Lambda (Python 3.11/3.12)
            │
            ├── DynamoDB (PAY_PER_REQUEST)
            ├── Cognito (auth)
            ├── S3 (assets + user media)
            └── OpenAI API (AI Builder)
```

---

## Módulos Terraform

| Módulo | Caminho | Responsabilidade |
|---|---|---|
| `foundation` | `modules/foundation` | Provider AWS, Route53, tags globais |
| `data` | `modules/data` | Todas as tabelas DynamoDB |
| `auth` | `modules/auth` | Cognito, Admin API Gateway, Lambdas admin |
| `compute` | `modules/compute` | Main API Gateway, Lambdas de produto |
| `frontend` | `modules/frontend` | AWS Amplify |
| `shared` | `modules/shared` | Lambda Layer compartilhada |
| `assets` (root) | `terraform_assets.tf` | S3 + CloudFront para exercícios |

---

## Frontend

### AWS Amplify

| Campo | Valor |
|---|---|
| App ID | `doms9vr9t4xn2` |
| Branch | `main` |
| Repositório | `https://github.com/paboobhzx/cosmo-workout-builder` |
| Build dir | `frontend/dist` |
| `VITE_API_URL` | `https://api.pablobhz.cloud` |
| URL pública | `https://cosmo.pablobhz.cloud` |
| Domínio prod | `cosmofit.com.br` |
| `prevent_destroy` | `true` |

**Build spec:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

**SPA Rewrite Rules (custom_rules):**
- `/assets/<*>` → 200
- `/<*>.js` → 200
- `/<*>.css` → 200
- `/<*>.ico` → 200
- `/<*>` → `/index.html` 200 (catch-all SPA)

---

## DNS / Route53

| Registro | Valor |
|---|---|
| Zona | `pablobhz.cloud` |
| API custom domain | `api.pablobhz.cloud` |
| Frontend | `cosmo.pablobhz.cloud` |
| Admin | `admin.pablobhz.cloud` |

---

## Autenticação — AWS Cognito

### User Pool

| Campo | Valor |
|---|---|
| Nome | `cosmo-users` |
| Username attribute | `email` |
| Auto-verified | `email` |
| Identity Provider | Google (OAuth2) |

**Google IdP — SSM Parameters:**
- Client ID: `/cosmo/auth/google/client_id`
- Client Secret: `/cosmo/auth/google/client_secret`

### User Pool Clients

| Cliente | Callback URLs | Uso |
|---|---|---|
| `cosmo-web` | `https://cosmo.pablobhz.cloud/auth/callback`, `https://cosmofit.com.br/auth/callback` | App principal |
| `cosmo-admin` | `https://admin.pablobhz.cloud/auth/callback`, `http://localhost:3001/auth/callback` | Painel admin |

### Grupos Cognito

| Grupo | Precedência | Descrição |
|---|---|---|
| `Admins` | 0 (mais alto) | Acesso total ao admin panel |

### Post-Authentication Trigger

- **Lambda:** `cosmo-post-auth`
- **Runtime:** Python 3.11 / 128 MB / timeout 10s
- **Responsabilidade:** Migração de dados de sessão anônima → usuário autenticado; inicialização de `cosmo-users` e `cosmo-tier-config`

---

## API Gateway

### Main API — `compute` module

| Campo | Valor |
|---|---|
| Tipo | HTTP API (v2) |
| Custom domain | `api.pablobhz.cloud` |
| Autorizador | JWT Cognito |
| CORS | Habilitado |

### Admin API — `auth` module

| Campo | Valor |
|---|---|
| Tipo | HTTP API (v2) |
| URL | `https://admin-api.pablobhz.cloud` (ou similar) |
| Autorizador | JWT Cognito (grupo Admins) |

---

## Lambda Functions

### Compute Module (`modules/compute`)

Todos: Python 3.11, Lambda Shared Layer, IAM role único (`cosmo-lambda-role`).

| Função | Handler | Timeout | Memória | Rotas principais |
|---|---|---|---|---|
| `cosmo-exercises` | `exercises_handler` | 30s | 256 MB | `GET/POST/PUT/DELETE /exercises` |
| `cosmo-workouts` | `workouts_handler` | 30s | 256 MB | `GET/POST/PUT/DELETE /workouts` |
| `cosmo-sessions` | `sessions_handler` | 30s | 256 MB | `GET/POST/PUT /sessions` |
| `cosmo-session-draft` | `session_draft_handler` | 30s | 256 MB | `GET/PUT /session-draft` |
| `cosmo-pdf-export` | `pdf_export_handler` | 60s | 512 MB | `POST /workouts/export-pdf` |
| `cosmo-measurements` | `measurements_handler` | 30s | 256 MB | `GET/POST/DELETE /measurements` |
| `cosmo-calendar` | `calendar_handler` | 30s | 256 MB | `GET/POST/DELETE /calendar` |
| `cosmo-analytics` | `analytics_handler` | 10s | 256 MB | `POST /analytics/event`, `GET /analytics/summary` |
| `cosmo-app-config` | `app_config_handler` | 15s | 256 MB | `GET/PUT /app-config`, `/app-config/i18n`, `/app-config/founder` |
| `cosmo-community-exercises` | `community_exercises_handler` | 30s | 256 MB | `GET/POST /community-exercises` |
| `cosmo-community-workouts` | `community_workouts_handler` | 30s | 256 MB | `GET/POST /community-workouts` |
| `cosmo-messages` | `messages_handler` | 30s | 256 MB | `GET/POST /messages` |
| `cosmo-trainer-links` | `trainer_links_handler` | 30s | 256 MB | `GET/POST/DELETE /trainer-links` |
| `cosmo-achievements` | `achievements_handler` | 30s | 256 MB | `GET /achievements` |
| `cosmo-feedback` | `feedback_handler` | 15s | 256 MB | `POST /feedback` |
| `cosmo-notices` | `notices_handler` | 15s | 256 MB | `GET /notices` |
| `cosmo-user-layout` | `user_layout_handler` | 15s | 256 MB | `GET/PUT /user-layout` |
| `cosmo-user-media` | `user_media_handler` | 30s | 256 MB | `POST /user-media/upload-url`, `DELETE /user-media/{type}` |
| `cosmo-payments` | `payments_handler` | 30s | 256 MB | Stripe webhooks + checkout |
| `cosmo-ai-builder` | `ai_builder_handler` | 60s | 512 MB | `GET /ai-builder/hubs`, `GET /ai-builder/hub-workouts`, `POST /ai-builder/generate`, `GET /ai-builder/cached` |

**Variáveis de ambiente do AI Builder:**
```
HUB_WORKOUTS_TABLE = cosmo-hub-workouts
EXERCISES_TABLE    = cosmo-exercises
USERS_TABLE        = cosmo-users
OPENAI_API_KEY     = (via SSM /cosmo/openai-api-key)
OPENAI_MODEL       = gpt-4o-mini
ENVIRONMENT        = dev
```

### Auth Module (`modules/auth`)

| Função | Runtime | Timeout | Memória | Rotas |
|---|---|---|---|---|
| `cosmo-admin-users` | Python 3.11 | 30s | 256 MB | `GET/PUT/DELETE /users` |
| `cosmo-admin-analytics` | Python 3.11 | 30s | 256 MB | `GET /analytics` |
| `cosmo-admin-presigned-url` | Python 3.11 | 15s | 128 MB | `POST /exercises/presigned-url` |
| `cosmo-post-auth` | Python 3.11 | 10s | 128 MB | Trigger Cognito post-auth |
| `cosmo-api-docs` | Python 3.11 | 15s | 128 MB | `GET /api-docs` |

### Root (terraform/) — Lambdas de Assets

| Função | Runtime | Timeout | Memória | Trigger |
|---|---|---|---|---|
| `cosmo-gif-to-webp` | Python 3.12 | 60s | 512 MB | S3 PutObject em `exercises/**/*.gif` |
| `cosmo-image-editor` | Python 3.12 | 120s | 1024 MB | Admin API (crop, rect, URL import) |

---

## Lambda Layers

| Layer | Compatibilidade | Conteúdo |
|---|---|---|
| `cosmo-lambda-shared` | Python 3.11, 3.12 | `response`, `auth`, `serializers`, `dynamo` |
| `cosmo-pillow-layer` | Python 3.12 | Pillow (PIL) para processamento de imagens |
| `reportlab` (externo) | Python 3.11 | `arn:aws:lambda:us-east-1:288854271409:layer:reportlab:1` |

### lambda_shared — Estrutura

```
python/
  lambda_shared/
    __init__.py
    response.py
    auth.py
    serializers.py
    dynamo.py
```

---

## DynamoDB Tables

Todas com billing mode `PAY_PER_REQUEST`. Deletion protection + PITR habilitados em `prod`.

| Tabela | PK | SK | GSI | TTL | Descrição |
|---|---|---|---|---|---|
| `cosmo-exercises` | `exerciseId` | — | — | — | Catálogo curado de exercícios |
| `cosmo-workouts` | `pk` (`USER#<userId>`) | `sk` (`WORKOUT#<id>` / `TRASH#<id>` / `SHARE#<id>`) | — | `expiresAt` | Treinos dos usuários + share links |
| `cosmo-workout-sessions` | `pk` | `sk` | — | — | Sessões de treino completadas |
| `cosmo-session-drafts` | — | — | — | — | Autosave de sessão em andamento |
| `cosmo-workouts-guest` | — | — | — | 24h | Treinos de usuários anônimos |
| `cosmo-users` | `userId` | — | `GSI_GYM` (`gym_id`) | — | Perfis: tier, role, is_founder, termsAcceptedAt |
| `cosmo-measurements` | — | — | — | — | Medidas corporais |
| `cosmo-calendar` | — | — | — | — | Agendamentos de treino |
| `cosmo-achievements` | — | — | — | — | Conquistas e badges |
| `cosmo-community-workouts` | — | — | — | — | Treinos compartilhados na comunidade |
| `cosmo-community-ratings` | — | — | — | — | Avaliações de treinos da comunidade |
| `cosmo-community-exercises` | — | — | — | — | Exercícios criados por usuários |
| `cosmo-messages` | — | — | — | — | Mensagens trainer↔aluno |
| `cosmo-trainer-links` | — | — | — | — | Vínculos N:N trainer↔aluno |
| `cosmo-plateau-alerts` | — | — | — | — | Alertas de platô de performance |
| `cosmo-feedback` | — | — | — | — | Feedbacks dos usuários |
| `cosmo-user-layout` | `pk` (`userId`) | `sk` (`"LAYOUT"`) | — | — | Preferências de layout do dashboard |
| `cosmo-subscriptions` | — | — | — | — | Histórico de assinaturas |
| `cosmo-tier-config` | — | — | — | — | Config de tier + contador atômico Founder 50 |
| `cosmo-gym-reviews` | — | — | — | — | Reviews anônimas de academias |
| `cosmo-app-config` | — | — | — | — | Listas de opções, i18n, config da app |
| `cosmo-notices` | — | — | — | — | Avisos/notificações do sistema |
| `cosmo-hub-workouts` | — | — | — | — | Cache de treinos gerados pelo AI Builder |

**cosmo-users — campos relevantes:**
```
userId, tier (free/premium/premium_lifetime/coach),
lifetimePremium (bool), is_founder (bool),
role (user/admin/trainer), status (active/disabled),
termsAcceptedAt, gym_id, gym_name, gym_city,
display_name, avatar_url, profile_public, gym_public
```

---

## S3 Buckets

### `cosmo-exercise-assets`

| Campo | Valor |
|---|---|
| Acesso público | Bloqueado (acesso via CloudFront OAC) |
| Versionamento | Desabilitado |
| CORS | GET, HEAD, PUT — `allowed_origins: ["*"]` |
| Estrutura | `exercises/**/*.gif`, `exercises/**/*.webp` |

### `cosmo-user-media`

| Campo | Valor |
|---|---|
| Acesso público | Bloqueado |
| Criptografia | AES256 (SSE-S3) |
| CORS | GET, PUT — origens: `cosmo.pablobhz.cloud`, `localhost:5173`, `cosmofit.com.br` |
| Estrutura | `{userId}/avatar.jpg`, `{userId}/photo-{1,2,3}.jpg` |
| Limite | 5 MB por arquivo (enforced via presigned URL + frontend) |

---

## CloudFront

### Exercise Assets CDN

| Campo | Valor |
|---|---|
| Origin | `cosmo-exercise-assets` (S3, via OAC) |
| IPv6 | Habilitado |
| Price class | `PriceClass_100` (US/EU) |
| Default TTL | 86.400s (1 dia) |
| Max TTL | 31.536.000s (1 ano) |
| Compressão | Habilitada |
| Restrição geográfica | Nenhuma |
| Certificado | CloudFront default (`*.cloudfront.net`) |
| Acesso S3 | Somente via OAC (SigV4) |

---

## SSM Parameter Store

| Parâmetro | Tipo | Uso |
|---|---|---|
| `/cosmo/auth/google/client_id` | SecureString | Google IdP — Cognito |
| `/cosmo/auth/google/client_secret` | SecureString | Google IdP — Cognito |
| `/cosmo/openai-api-key` | SecureString | AI Builder Lambda |

---

## Stripe (Web Only)

Configurado via variáveis Terraform sensíveis. **Não usado no iOS.**

| Variável | Descrição |
|---|---|
| `stripe_secret_key` | Chave secreta Stripe |
| `stripe_webhook_secret` | Segredo do webhook |
| `stripe_price_id` | ID do preço padrão (R$14,90/mês) |
| `stripe_intro_price_id` | ID do preço intro (R$9,90 primeiro mês) |
| `frontend_url` | URL para redirect pós-checkout |

---

## Monitoramento

### CloudWatch

- Logs habilitados para todas as Lambdas via `AWSLambdaBasicExecutionRole`
- Alarme SNS para abuso do AI Builder (`ai_alert_email = pablobhz@gmail.com`)

---

## IAM Roles

| Role | Usado por | Permissões principais |
|---|---|---|
| `cosmo-lambda-role` | Todas as Lambdas do compute | DynamoDB (todas as tabelas), S3 user-media, CloudWatch Logs |
| `cosmo-admin-lambda-role` | Lambdas do auth/admin | DynamoDB (exercises, users, tier-config), Cognito (full admin), S3 (exercise assets), API Gateway (read) |
| `cosmo-gif-to-webp-role` | gif-to-webp + image-editor | S3 (exercise-assets get/put), DynamoDB (cosmo-exercises updateItem), CloudWatch Logs |

---

## Rotas API — Resumo Completo

### Main API (`api.pablobhz.cloud`)

| Rota | Auth | Lambda |
|---|---|---|
| `GET /exercises` | Pública | exercises |
| `POST /exercises` | JWT | exercises |
| `PUT /exercises/{id}` | JWT | exercises |
| `DELETE /exercises/{id}` | JWT | exercises |
| `GET /workouts` | JWT | workouts |
| `POST /workouts` | JWT | workouts |
| `PUT /workouts/{id}` | JWT | workouts |
| `DELETE /workouts/{id}` | JWT | workouts |
| `GET /sessions` | JWT | sessions |
| `POST /sessions` | JWT | sessions |
| `PUT /sessions/{id}` | JWT | sessions |
| `GET /session-draft` | JWT | session-draft |
| `PUT /session-draft` | JWT | session-draft |
| `GET /measurements` | JWT | measurements |
| `POST /measurements` | JWT | measurements |
| `DELETE /measurements/{id}` | JWT | measurements |
| `GET /calendar` | JWT | calendar |
| `POST /calendar` | JWT | calendar |
| `DELETE /calendar` | JWT | calendar |
| `POST /analytics/event` | JWT | analytics |
| `GET /analytics/summary` | JWT | analytics |
| `GET /app-config` | Pública | app-config |
| `PUT /app-config` | JWT | app-config |
| `GET /app-config/i18n` | Pública | app-config |
| `PUT /app-config/i18n` | JWT | app-config |
| `GET /app-config/founder` | Pública | app-config |
| `GET /community-exercises` | Pública/JWT | community-exercises |
| `POST /community-exercises` | JWT | community-exercises |
| `GET /community-workouts` | Pública/JWT | community-workouts |
| `POST /community-workouts` | JWT | community-workouts |
| `GET /messages` | JWT | messages |
| `POST /messages` | JWT | messages |
| `GET /trainer-links` | JWT | trainer-links |
| `POST /trainer-links` | JWT | trainer-links |
| `DELETE /trainer-links` | JWT | trainer-links |
| `GET /achievements` | JWT | achievements |
| `POST /feedback` | JWT | feedback |
| `GET /notices` | Pública | notices |
| `GET /user-layout` | JWT | user-layout |
| `PUT /user-layout` | JWT | user-layout |
| `POST /user-media/upload-url` | JWT | user-media |
| `DELETE /user-media/{type}` | JWT | user-media |
| `GET /ai-builder/hubs` | Pública | ai-builder |
| `GET /ai-builder/hub-workouts` | Pública | ai-builder |
| `POST /ai-builder/generate` | JWT | ai-builder |
| `GET /ai-builder/cached` | Pública | ai-builder |

> Todas as rotas têm correspondente `OPTIONS` para CORS preflight.

### Admin API

| Rota | Auth | Lambda |
|---|---|---|
| `GET/PUT/DELETE /users` | JWT (Admins) | admin-users |
| `GET /analytics` | JWT (Admins) | admin-analytics |
| `POST /exercises/presigned-url` | JWT (Admins) | admin-presigned-url |
| `POST /exercises/image-editor` | JWT (Admins) | image-editor |
| `GET/POST/PUT /feedback` | JWT (Admins) | feedback |
| `GET/POST/PUT/DELETE /notices` | JWT (Admins) | notices |
| `GET /api-docs` | JWT (Admins) | api-docs |

---

## Problemas Conhecidos (Infraestrutura)

| Problema | Status | Impacto |
|---|---|---|
| `session-draft` sem rota no API Gateway | Não corrigido | Feature de autosave quebrada em produção |
| `cosmo-session-drafts` DynamoDB table sem rotas wired | Não corrigido | Lambda existe, API Gateway não expõe |
| Share TTL (`expiresAt`) sem config Terraform | Não corrigido | TTL de links compartilhados não expira |
| 74 call sites usando `fetch` raw ao invés de `apiClient` | Não corrigido | Bypass de interceptors, sem tratamento consistente de erros |

---

## Variáveis Terraform Principais

```hcl
aws_region   = "us-east-1"
environment  = "dev"
project_name = "cosmo"
root_domain  = "pablobhz.cloud"

# Sensíveis (não commitadas)
github_token          = "..."
stripe_secret_key     = "..."
stripe_webhook_secret = "..."
stripe_price_id       = "..."
stripe_intro_price_id = "..."
openai_api_key        = "..."   # via SSM
ai_alert_email        = "pablobhz@gmail.com"
```
