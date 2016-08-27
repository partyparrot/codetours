import React from "react";
import _ from "lodash";
import { Tours, Pages } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';

import Snippet from './Snippet';
import Section from './Section';


class Page extends React.Component {

  constructor(props) {
    super(props);
  }

  onSelect(section) {
    console.log('section', section);
    // this.setState();
  }

  render() {

    if (!this.props.page) {
      return <div>Loading...</div>
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8">
            <Snippet code={this.props.page.code} startLineNumber={10} highlightLineNumbers={[15, 16, 17, 18, 22, 23]}/>
          </div>
          <div className="col-xs-12 col-md-4">
            {
              _.map(this.props.page.content, (section, index) => {
                return (
                  <Section key={index} section={section} onSelect={this.onSelect.bind(this, section)} />
                );
              })
            }
          </div>
        </div>
      </div>
    );

  }
}

const PageContainer = createContainer(({ params }) => {
  return {
    page: Pages.findOne()
  }
}, Page);


export default PageContainer;
