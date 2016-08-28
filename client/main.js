import React from 'react';
import { render } from 'react-dom';
import StepContainer from './Step';
import { Router, Route, Link, browserHistory } from 'react-router';
import RecentTours from './RecentTours';

Meteor.startup(() => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={Frontpage} />
      <Route path="/tour/:user/:repoName" component={Tour} />
      <Route path="/tour/:user/:repoName/:stepSlug" component={StepContainer} />
    </Router>
  ), document.getElementById('root'))
});

class App extends React.Component {
  render() {
    return (
      <div>
        <StepContainer />
      </div>
    );
  }
}

class Frontpage extends React.Component {
  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <div className="container">
            <h1>CodeTours!</h1>
            <p>Get introduced to a new and exciting codebase.</p>
            <div className="row">
              <div className="col-sm-6 col-sm-offset-3">
                <div className="input-group">
                  <input type="text" className="form-control input-lg" placeholder="Search for a repository" />
                  <span className="input-group-btn">
                    <button className="btn btn-success btn-lg" type="button">Go!</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <RecentTours />
            </div>
            <div className="col-sm-4">
              <h3>Create a tour</h3>
              <p>{"Help explain your project, or someone else's."}</p>
              <ol>
                <li>{"Fork the starter kit, or someone else's tour"}</li>
                <li>Edit the config file, content, and code links</li>
                <li>Import your code tour below:</li>
              </ol>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Your repository name here" />
                <span className="input-group-btn">
                  <button className="btn btn-success" type="button">Go!</button>
                </span>
              </div>
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
