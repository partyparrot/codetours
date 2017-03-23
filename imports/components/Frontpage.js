import { Meteor } from 'meteor/meteor';
import React from 'react';
import marked from 'marked';
import Headtags from './Headtags';
import RecentTours from './RecentTours';
import Sidebar from './Sidebar';

export default class Frontpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(event) {
    this.setState({
      search: event.target.value,
    });
  }

  render() {
    const brandNameStyle = {
      fontFamily: "'Pacifico', cursive",
      textShadow: 'black 0 0 5px',
    };

    const heroStyle = {
      backgroundImage: 'url("/background.jpeg")',
      backgroundSize: '100%',
      color: 'white',
    };

    const taglineStyle = {
      textShadow: 'black 0 0 5px',
    };

    return (
      <div>
        <Headtags pathname={this.props.location.pathname} />
        <div className="jumbotron text-center" style={heroStyle}>
          <div className="container">
            <div style={brandNameStyle}>
              <h1>CodeTours</h1>
            </div>
            <p style={taglineStyle}>Take a tour of new and exciting open source codebases.</p>
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
              <RecentTours search={this.state.search} />
            </div>
            <Sidebar />
          </div>
          <div className="footer">
            <p
              dangerouslySetInnerHTML={{
                __html: marked(
                  `
Made with ![Fiesta Parrot](/fiestaparrot.gif)
by [Angela Zhang](https://github.com/zhangela) and
[Sashko Stubailo](https://github.com/stubailo).
[Contribute on GitHub.](https://github.com/partyparrot/codetours)
            `
                ),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
