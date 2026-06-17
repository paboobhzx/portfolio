#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./apply.sh -m "Commit message" [-r aws-region] [-p ssm-parameter-name]

Required:
  -m    Commit message used for git commit and push flow

Optional:
  -r    AWS region for SSM lookup (default: us-east-1)
  -p    Explicit SSM parameter name for github token

Behavior:
  1) Resolve GitHub token from AWS SSM Parameter Store
  2) Run terraform apply with:
       -var github_repository=https://github.com/paboobhzx/pablobhz-portfolio
       -var github_token=<token-from-ssm>
  3) Commit and push current git changes with the provided message
EOF
}

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: required command not found: $cmd" >&2
    exit 1
  fi
}

COMMIT_MSG=""
AWS_REGION="us-east-1"
SSM_PARAM_NAME=""
DEFAULT_SSM_PARAM_ARN="arn:aws:ssm:us-east-1:288854271409:parameter/superdoc/github/access_token"
REPO_URL="https://github.com/paboobhzx/pablobhz-portfolio"

while getopts ":m:r:p:h" opt; do
  case "${opt}" in
    m) COMMIT_MSG="${OPTARG}" ;;
    r) AWS_REGION="${OPTARG}" ;;
    p) SSM_PARAM_NAME="${OPTARG}" ;;
    h)
      usage
      exit 0
      ;;
    :)
      echo "Error: option -${OPTARG} requires an argument." >&2
      usage
      exit 1
      ;;
    \?)
      echo "Error: invalid option -${OPTARG}" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${COMMIT_MSG}" ]]; then
  echo "Error: commit message is required. Use -m \"...\"." >&2
  usage
  exit 1
fi

require_cmd aws
require_cmd terraform
require_cmd git

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TF_PROD_DIR="${SCRIPT_DIR}/terraform/environments/prod"

resolve_ssm_param_name() {
  if [[ -n "${SSM_PARAM_NAME}" ]]; then
    echo "${SSM_PARAM_NAME}"
    return 0
  fi
  echo "${DEFAULT_SSM_PARAM_ARN}"
}

echo "Resolving GitHub token from SSM Parameter Store in ${AWS_REGION}..."
PARAM_NAME="$(resolve_ssm_param_name)"
echo "Using SSM parameter: ${PARAM_NAME}"

GITHUB_TOKEN="$(
  aws ssm get-parameter \
    --region "${AWS_REGION}" \
    --name "${PARAM_NAME}" \
    --with-decryption \
    --query 'Parameter.Value' \
    --output text
)"

if [[ -z "${GITHUB_TOKEN}" ]]; then
  echo "Error: received an empty token from ${PARAM_NAME}." >&2
  exit 1
fi

if [[ ! -d "${TF_PROD_DIR}" ]]; then
  echo "Error: terraform prod directory not found: ${TF_PROD_DIR}" >&2
  exit 1
fi

echo "Running terraform apply in ${TF_PROD_DIR}..."
(
  cd "${TF_PROD_DIR}"
  terraform apply -input=false -auto-approve \
    -var "github_repository=${REPO_URL}" \
    -var "github_token=${GITHUB_TOKEN}"
)

echo "Committing and pushing changes..."
(
  cd "${REPO_ROOT}"
  git add -A
  if git diff --cached --quiet; then
    echo "No git changes staged; skipping commit."
  else
    git commit -m "${COMMIT_MSG}"
    git push
  fi
)

echo "Done."
