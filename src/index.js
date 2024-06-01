import React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'flowbite';
import './styles/index.css';
import App from './components/App';

// 1
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';

// 2
const httpLink = createHttpLink({
  // uri: 'http://localhost:3000/graphql'
  uri: 'https://budgetr.nurey.com/graphql'
});

// 3
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

// 4
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
