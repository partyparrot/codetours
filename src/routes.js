import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Frontpage from './components/Frontpage';
import TourContainer from './components/Tour';
import StepContainer from './components/Step';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Frontpage} />
    <Route path="/tour/:user/:repoName" component={TourContainer} />
    <Route path="/tour/:user/:repoName/:stepSlug" component={StepContainer} addHandlerKey={true} />
    <Route path="/tour/:user/:repoName/:stepSlug/:sectionIndex" component={StepContainer} />
  </Router>
);

export default routes;
