import React from 'react';
import { render } from 'react-dom';
import StepContainer from './Step';
import TourContainer from './Tour';
import { Router, Route, Link, browserHistory } from 'react-router';
import RecentTours from './RecentTours';
import marked from 'marked';

Meteor.startup(() => {
  Meteor.subscribe('tours');

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

  handleImportSubmit(event) {
    event.preventDefault();
    const tourRepository = event.target.tourRepository.value;
    Meteor.call('importTour', tourRepository, (err, res) => {
      if (err) {
        alert(err.reason);
      } else {
        browserHistory.push(`/tour/${tourRepository}`);
      }
    });
  }

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <div className="container">
            <h1>CodeTours!</h1>
            <p>Introduce yourself to new exciting open source codebases.</p>
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
              <form className="input-group" onSubmit={this.handleImportSubmit}>
                <input type="text" name="tourRepository" className="form-control" placeholder="Your repository name here" />
                <span className="input-group-btn">
                  <input type="submit" className="btn btn-success" value="Go!" />
                </span>
              </form>
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
