resource "aws_s3_bucket" "media" {
  bucket = "${var.name_prefix}-media"

  tags = {
    ManagedBy = "terraform"
  }
}

resource "aws_dynamodb_table" "pages" {
  name         = "${var.name_prefix}-pages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pageId"

  attribute {
    name = "pageId"
    type = "S"
  }

  tags = {
    ManagedBy = "terraform"
  }
}

resource "aws_cognito_user_pool" "cms" {
  name = "${var.name_prefix}-cms-users"
}

resource "aws_cognito_user_pool_client" "cms" {
  name         = "${var.name_prefix}-cms-client"
  user_pool_id = aws_cognito_user_pool.cms.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user_group" "admin" {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.cms.id
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.name_prefix}-cms-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.name_prefix}-cms-lambda-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:DeleteItem"
        ]
        Resource = aws_dynamodb_table.pages.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.media.arn}/*"
      }
    ]
  })
}

resource "aws_lambda_function" "cms" {
  function_name = "${var.name_prefix}-cms-api"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  filename      = "${path.module}/lambda/cms-api.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/cms-api.zip")

  timeout = 10

  environment {
    variables = {
      PAGES_TABLE_NAME  = aws_dynamodb_table.pages.name
      MEDIA_BUCKET_NAME = aws_s3_bucket.media.bucket
      AWS_REGION_NAME   = var.aws_region
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.cms.id
    }
  }
}

resource "aws_apigatewayv2_api" "cms" {
  name          = "${var.name_prefix}-cms-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "cms" {
  api_id                 = aws_apigatewayv2_api.cms.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.cms.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.cms.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.cms.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.cms.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cms.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.cms.execution_arn}/*/*"
}
