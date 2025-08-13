import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { nhost } from './nhost'

// Build WebSocket URL manually
const subdomain = 'juivpqeyjtsbtkalhpol'
const region = 'ap-south-1'
const wsUrl = `wss://${subdomain}.hasura.${region}.nhost.run/v1/graphql`

const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl()
})

const authLink = setContext(async (_, { headers }) => {
  const token = await nhost.auth.getAccessToken()
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const wsLink = new GraphQLWsLink(createClient({
  url: wsUrl,
  connectionParams: async () => {
    const token = await nhost.auth.getAccessToken()
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  }
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})