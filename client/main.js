import React from 'react';
import { render } from 'react-dom';
import StepContainer from './Step';
import TourContainer from './Tour';
import { Router, Route, Link, browserHistory } from 'react-router';
import RecentTours from './RecentTours';
import marked from 'marked';

Meteor.startup(() => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={Frontpage} />
      <Route path="/tour/:user/:repoName" component={TourContainer} />
      <Route path="/tour/:user/:repoName/:stepSlug" component={StepContainer} />
    </Router>
  ), document.getElementById('root'))
});


class Frontpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(event) {
    this.setState({
      search: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <div className="container">
            <h1>CodeTours!</h1>
            <p>Get introduced to a new and exciting codebase.</p>
            <div className="row">
              <div className="col-sm-6 col-sm-offset-3">
                <input
                  type="text"
                  className="form-control input-lg"
                  placeholder="Search for a repository"
                  onChange={this.handleSearchChange}
                  value={this.state.search}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <RecentTours search={this.state.search}/>
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
          <div className="footer">
            <p dangerouslySetInnerHTML={{__html: marked(`
Made with ![Fiesta Parrot](http://cultofthepartyparrot.com/parrots/fiestaparrot.gif)
by [Angela Zhang](https://github.com/zhangela) and
[Sashko Stubailo](https://github.com/stubailo).
[Contribute on GitHub.](https://github.com/partyparrot/codetours)
            `)}} />
          </div>
        </div>
      </div>
    );
  }
}
