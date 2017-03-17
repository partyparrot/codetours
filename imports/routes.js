import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import lazyEvalComponent from './lazyEvalComponent';

import Frontpage from './components/Frontpage';
import TourContainer from './components/Tour';

const lazyStep = lazyEvalComponent(() => require('./components/Step'));

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Frontpage} />
    <Route path="/tour/:user/:repoName" component={props => <TourContainer {...props} />} />
    <Route path="/tour/:user/:repoName/:stepSlug" component={lazyStep} addHandlerKey={true} />
    <Route path="/tour/:user/:repoName/:stepSlug/:sectionIndex" component={lazyStep} />
  </Router>
);

export default routes;
