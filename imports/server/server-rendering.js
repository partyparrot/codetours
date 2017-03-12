import { WebApp } from 'meteor/webapp';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';

import Headtags from '../components/Headtags';

// request middleware to server-side render the head tags
const serverRendering = (req, res, next) => {
  // get head tags from relative path
  const component = <Headtags pathname={req.originalUrl} />;

  // render head tags component (helmet under the hood)
  // note: would be great to have the real comp to show or a nice loading comp
  req.dynamicBody = ReactDOM.renderToStaticMarkup(component);

  // avoid memory link by rewinding head tags
  const head = Helmet.rewind();

  // append the head tags to the head
  req.dynamicHead = `
    ${head.title.toString()}
    ${head.meta.toString()}
    ${head.link.toString()}
  `;

  next();
};

// attach the handler to webapp
WebApp.connectHandlers.use(serverRendering);
