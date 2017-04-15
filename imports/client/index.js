/* globals ga */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { meteorClientConfig } from 'meteor/apollo';
import printTime from '../printTime';

import routes from '../routes';

printTime('main.js');

const client = new ApolloClient(
  meteorClientConfig({
    initialState: window.__APOLLO_STATE__,
  })
);

Meteor.startup(() => {
  printTime('Meteor startup fired');
  render(
    <ApolloProvider client={client}>{routes}</ApolloProvider>,
    document.getElementById('root')
  );
  printTime('after render');
});

browserHistory.listen(() => {
  ga('send', 'pageview', window.location.pathname);
});
