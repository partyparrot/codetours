import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import { ApolloClient, ApolloProvider, renderToStringWithData } from 'react-apollo';
import { match, RouterContext } from 'react-router';
import 'isomorphic-fetch';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { meteorClientConfig } from 'meteor/apollo';

import routes from '../routes';

const Body = ({ content, state }) => (
  <body>
    <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`,
      }}
    />
  </body>
);

const serverRendering = (req, res, next) => match({ routes, location: req.originalUrl }, async (
  error,
  redirectLocation,
  renderProps
) => {
  if (redirectLocation) {
    res.redirect(redirectLocation.pathname + redirectLocation.search);
  } else if (error) {
    console.error('ROUTER ERROR:', error); // eslint-disable-line no-console
    res.writeHead(500);
  } else if (renderProps) {
    const client = new ApolloClient(meteorClientConfig());

    const component = (
      <ApolloProvider client={client}>
        <RouterContext {...renderProps} />
      </ApolloProvider>
    );
    try {
      const content = await renderToStringWithData(component);
      const initialState = { apollo: client.getInitialState() };

      const html = <Body content={content} state={initialState} />;

      // actually appending it to the end result
      req.dynamicBody = ReactDOM.renderToString(html);

      // avoid memory link by rewinding head tags
      const head = Helmet.rewind();

      // append the head tags to the head
      req.dynamicHead = `
      ${head.title.toString()}
      ${head.meta.toString()}
      ${head.link.toString()}
      `;

      next();
    } catch (error) {
      console.error('Server-rendering error', error); // eslint-disable-line no-console
      res.writeHead(500);
      res.write('Server-rendering error');
      res.end();
    }
  } else {
    console.log('not found'); // eslint-disable-line no-console
    res.writeHead(404);
    res.end();
  }
});

// attach the handler to webapp
WebApp.connectHandlers.use(Meteor.bindEnvironment(serverRendering));
