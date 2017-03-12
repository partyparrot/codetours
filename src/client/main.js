import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import routes from '../routes';

Meteor.startup(() => render(routes, document.getElementById('root')));

browserHistory.listen(() => {
  ga('send', 'pageview', window.location.pathname);
});
