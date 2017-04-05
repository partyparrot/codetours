import React from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './mocks/client';
import Theme from '../imports/components/Theme';

const globalDecoratorPatch = story => (
  <ApolloProvider client={client}>
    <Theme>{story()}</Theme>
  </ApolloProvider>
);

export default globalDecoratorPatch;
