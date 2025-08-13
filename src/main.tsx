import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NhostProvider } from '@nhost/react'
import { nhost } from './nhost'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
</NhostProvider>
  </React.StrictMode>
)
