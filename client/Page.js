import React from "react";
import _ from "lodash";
import { Tours, Pages } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';

import Snippet from './Snippet';
import Section from './Section';


class Page extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      highlightLineNumbers: []
    };
  }

  onSelect(section) {
    this.setState({
      highlightLineNumbers: _.range(parseInt(section.lineStart), parseInt(section.lineEnd) + 1)
    });
  }

  render() {
    if (!this.props.page) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div className="left">
          <div>URL: {this.props.page.codeUrl}</div>
          <div>Commit: {this.props.page.commit}</div>
          <Snippet
            code={this.props.page.code}
            highlightLineNumbers={this.state.highlightLineNumbers}/>
        </div>
        <div className="right">
          {
            _.map(this.props.page.content, (section, index) => {
              return (
                <Section key={index} section={section} onSelect={this.onSelect.bind(this, section)} />
              );
            })
          }
        </div>
      </div>
    );

  }
}

const PageContainer = createContainer(({ params }) => {
  return {
    page: Pages.findOne({slug: "connector.md"})
  }
}, Page);


export default PageContainer;
