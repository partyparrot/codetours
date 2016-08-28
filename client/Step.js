import React from "react";
import _ from "lodash";
import { Tours, Steps } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

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

  getStepNumber(slug) {
    return _.indexOf(this.props.tour.steps, slug) + 1;
  }

  getStepLink(step) {
    return `/tour/${this.props.tour.repository}/${step}`;
  }

  getTourLink() {
    return `/tour/${this.props.tour.repository}`;
  }

  getNextStepLink() {
    const curIndex = _.indexOf(this.props.tour.steps, this.props.step.slug);
    const nextStep = this.props.tour.steps[curIndex + 1];
    if (nextStep) {
      return <Link to={this.getStepLink(nextStep)}>Next Step</Link>;
    } else {
      return <Link to={this.getTourLink()}>Back to Tour</Link>;
    }
  }

  getPrevStepLink() {
    const curIndex = _.indexOf(this.props.tour.steps, this.props.step.slug);
    const prevStep = this.props.tour.steps[curIndex - 1];
    if (prevStep) {
      return <Link to={this.getStepLink(prevStep)}>Prev Step</Link>;
    } else {
      return <Link to={this.getTourLink()}>Back to Tour</Link>;
    }
  }

  render() {
    console.log(this.props.step);
    // debugger;
    if (!this.props.step) {
      return <div>Loading...</div>
    }

    return (
      <div>
        {this.getPrevStepLink()}
        {this.getNextStepLink()}
        <h1>Step {this.getStepNumber(this.props.step.slug)}. {this.props.step.title}</h1>
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
