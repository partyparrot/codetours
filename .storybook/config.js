import { configure /*, addDecorator*/ } from '@kadira/storybook';
// import React from 'react';
// import { ApolloProvider } from 'react-apollo';
// import client from './mocks/client';
// import Theme from '../imports/components/Theme';

const req = require.context('../imports/components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// failing addDecorator in storyshots
// see:
// - https://github.com/storybooks/storyshots/issues/59
// - https://github.com/storybooks/storyshots/issues/68

// addDecorator(story => (
//   <ApolloProvider client={client}>
//     <Theme>{story()}</Theme>
//   </ApolloProvider>
// ));

configure(loadStories, module);
