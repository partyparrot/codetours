import React from "react";
import _ from "lodash";
import { Tours, Steps } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';

import Snippet from './Snippet';
import Section from './Section';

class Step extends React.Component {

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
    if (!this.props.step) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div className="left">
          <div>URL: {this.props.step.codeUrl}</div>
          <div>Commit: {this.props.step.commit}</div>
          <Snippet
            code={this.props.step.code}
            highlightLineNumbers={this.state.highlightLineNumbers}/>
        </div>
        <div className="right">
          {
            _.map(this.props.step.content, (section, index) => {
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

const StepContainer = createContainer(({ params }) => {
  const tourName = `${params.user}/${params.repoName}`;
  return {
    step: Steps.findOne(
      {
        tourName,
        slug: params.stepSlug
      }
    ),
    tour: Tours.findOne({
      repository: tourName
    })
  }
}, Step);


export default StepContainer;
