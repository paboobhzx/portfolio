import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import App from './App.jsx'
import { appConfig } from './lib/config'
import './styles/global.css'

if (appConfig.cognito.userPoolId && appConfig.cognito.userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: appConfig.cognito.userPoolId,
        userPoolClientId: appConfig.cognito.userPoolClientId,
      },
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
