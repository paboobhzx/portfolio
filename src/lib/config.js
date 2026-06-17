export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || '',
  awsRegion: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  },
}
