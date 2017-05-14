import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import { ApolloClient, ApolloProvider, renderToStringWithData } from 'react-apollo';
import { match, RouterContext } from 'react-router';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import 'isomorphic-fetch';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { meteorClientConfig } from 'meteor/apollo';

import routes from '../routes';
import Theme from '../components/shared/Theme';

const Body = ({ content, state }) => (
  <body>
    <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
    <style
      dangerouslySetInnerHTML={{
        __html: styleSheet.rules().map(rule => rule.cssText).join('\n'),
      }}
    />
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
        <Theme>
          <RouterContext {...renderProps} />
        </Theme>
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

      // append the head tags to the heads
      req.dynamicHead = `
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
      `;

      next();
    } catch (error) {
      console.error('[server-rendering error]', error.stack); // eslint-disable-line no-console
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
