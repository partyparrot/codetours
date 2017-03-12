/* globals ga */
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import printTime from '../printTime';

import routes from '../routes';

printTime('main.js');

Meteor.startup(() => {
  printTime('Meteor startup fired');
  render(routes, document.getElementById('root'));
  printTime('after render');
});

browserHistory.listen(() => {
  ga('send', 'pageview', window.location.pathname);
});
