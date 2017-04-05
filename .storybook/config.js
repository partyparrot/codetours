import { configure, addDecorator } from '@kadira/storybook';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import Theme from '../imports/components/Theme';
import client from './mocks/client';

const req = require.context('../imports/components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => (
  <ApolloProvider client={client}>
    <Theme>{story()}</Theme>
  </ApolloProvider>
));

configure(loadStories, module);
