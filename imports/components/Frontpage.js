import React from 'react';
import marked from 'marked';
import Headtags from './Headtags';
import Header from './Header';
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
    this.setState(() => ({
      search: event.target.value,
    }));
  }

  render() {
    return (
      <div>
        <Headtags />
        <Header handleSearchChange={this.handleSearchChange} search={this.state.search} />
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
