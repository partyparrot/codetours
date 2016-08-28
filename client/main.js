import React from 'react';
import { render } from 'react-dom';
import PageContainer from './Page';
import { Router, Route, Link, browserHistory } from 'react-router';



Meteor.startup(() => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={Frontpage} />
      <Route path="/tour/:user/:repoName" component={Tour} />
      <Route path="/tour/:user/:repoName/:pageSlug" component={PageContainer} />
    </Router>
  ), document.getElementById('root'))
});

class App extends React.Component {
  render() {
    return (
      <div>
        <PageContainer />
      </div>
    );
  }
}

class Frontpage extends React.Component {
  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>CodeTours!</h1>
          <p>Get introduced to a new and exciting codebase.</p>
          <div className="row">
            <div className="col-sm-8">
              <div className="input-group">
                <input type="text" className="form-control input-lg" placeholder="Search for..." />
                <span className="input-group-btn">
                  <button className="btn btn-success btn-lg" type="button">Go!</button>
                </span>
              </div>
            </div>
            <div className="col-sm-4">
              <a className="btn btn-primary btn-lg" href="#" role="button">Create a tour!</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Tour extends React.Component {
  render() {
    return (
      <div>
        CodeTours!
      </div>
    );
  }
}
