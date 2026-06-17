output "api_url" {
  value = aws_apigatewayv2_api.cms.api_endpoint
}

output "user_pool_id" {
  value = aws_cognito_user_pool.cms.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.cms.id
}
