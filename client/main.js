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
      <Route path="/tour/:user/:repoName/:stepSlug" component={StepContainer} addHandlerKey={true} />
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
        browserHistory.push(`/tour/${res}`);
      }
    });
  }

  render() {
    const brandNameStyle = {
      fontFamily: "'Pacifico', cursive",
      textShadow: "black 0 0 5px",
    }

    const heroStyle = {
      backgroundImage: 'url("/background.jpeg")',
      backgroundSize: "100%",
      color: "white"
    };

    const taglineStyle = {
      textShadow: "black 0 0 5px",
    };

    return (
      <div>
        <div className="jumbotron text-center" style={heroStyle}>
          <div className="container">
            <div style={brandNameStyle}>
              <h1>CodeTours</h1>
            </div>
            <p style={taglineStyle}>Introduce yourself to new and exciting open source codebases.</p>
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
              <h3>What's a CodeTour?</h3>
              <p>{"A CodeTour is a way for you to introduce new developers to your codebase by giving them a guided tour."}</p>

              <h3>Why make a CodeTour?</h3>
              <p>You are hiring like crazy, and you don't want to spend hours sitting down with each new hire and walking through your codebase.</p>
              <p>You are the maintainer of a large open source project, and you want to make it super easy for people to understand how it works and contribute.</p>
              <p>You are building out a GitHub portfolio, and want to be able to highlight important parts of your projects.</p>
              <p>You are a good person and want to share and grow the world's knowledge by teaching other people how your favorite libraries and frameworks work.</p>
              <h3>How do I make a CodeTour?</h3>

              <p>
                <b>If this is your first time making a tour, take a few minutes to check out our <Link to="/tour/partyparrot/codetours-starter-kit">
                  CodeTour for CodeTour
                </Link></b> (it's meta, we know). We promise everything will make a lot more sense after taking this tour.
              </p>

              <p>If you've done it before, here's the TL;DR in case you need a reminder:</p>
              <ol>
                <li>Fork the starter kit, or another existing tour</li>
                <li>Edit the config file, content, and code links</li>
                <li>Import your code tour here:</li>
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
