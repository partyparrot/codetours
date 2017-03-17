import React from 'react';
import ReactDOM from 'react-dom';
import { pure, branch, renderComponent, withProps, compose } from 'recompose';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import { graphql, gql } from 'react-apollo';

import Headtags from './Headtags';
import Snippet from './Snippet';
import Section from './Section';
import ParrotSays from './ParrotSays';

import printTime from '../printTime';

printTime('step evaluating');

class Step extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightLineNumbers: [],
    };

    // this is required so that when we navigate to different step, we can
    // reset the highlight to the right section.
    if (this.props.step) {
      // const section = this.props.step.content[0];
      this.state.slug = this.props.step.slug;
      this.state.selectedIndex = 0;
    }

    if (this.props.params.sectionIndex) {
      this.state.selectedIndex = parseInt(this.props.params.sectionIndex, 10);
    }
  }

  componentWillReceiveProps(newProps) {
    // this is required so that when we navigate to different step, we can
    // reset the highlight to the right section.
    if (newProps.step && this.state.slug !== newProps.step.slug) {
      if (this.props.params.sectionIndex) {
        this.setState({
          slug: newProps.step.slug,
          selectedIndex: parseInt(this.props.params.sectionIndex, 10),
        });

        this.needsToScroll = true;
      } else {
        this.setState({
          slug: newProps.step.slug,
          selectedIndex: 0,
        });
      }
    }
  }

  componentDidMount() {
    if (this.needsToScroll && this.highlightedSection) {
      this.highlightedSection.scrollIntoView({ behavior: 'smooth' });
      this.needsToScroll = false;
    }
  }

  componentDidUpdate() {
    if (this.needsToScroll && this.highlightedSection) {
      this.highlightedSection.scrollIntoView({ behavior: 'smooth' });
      this.needsToScroll = false;
    }
  }

  onSelect(index) {
    this.setState({
      selectedIndex: index,
    });
    browserHistory.replace(`${this.getStepLink(this.props.step.slug)}/${index}`);
  }

  getLineNumbersForCurrentSection() {
    return this.props.step &&
      this.getLineNumbersForSection(this.props.step.content[this.state.selectedIndex]);
  }

  getLineNumbersForSection(section) {
    if (!section) {
      return [];
    }
    return _.range(parseInt(section.lineStart, 10), parseInt(section.lineEnd, 10) + 1);
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
      return (
        <Link className="next-step btn btn-default" to={this.getStepLink(nextStep)}>
          {this.props.step.getNextStep().getFullTitle()}&nbsp;
          <span className="glyphicon glyphicon-arrow-right" />
        </Link>
      );
    } else {
      return (
        <Link className="next-step btn btn-default" to={this.getTourLink()}>
          Back to Tour&nbsp;
          <span className="glyphicon glyphicon-arrow-right" />
        </Link>
      );
    }
  }

  getPrevStepLink() {
    const curIndex = _.indexOf(this.props.tour.steps, this.props.step.slug);
    const prevStep = this.props.tour.steps[curIndex - 1];
    if (prevStep) {
      return (
        <Link to={this.getStepLink(prevStep)} className="btn btn-default">
          <span className="glyphicon glyphicon-arrow-left" />&nbsp;
          {this.props.step.getPrevStep().getFullTitle()}
        </Link>
      );
    }
  }

  render() {
    return (
      <div>
        <Headtags pathname={this.props.location.pathname} />
        <div className="left">
          <div className="source-link">
            <a href={this.props.step.codeUrl}>
              {this.props.step.fullRepoName}/<strong>{this.props.step.filePath}</strong>
            </a>
          </div>
          <Snippet
            code={this.props.step.code}
            filePath={this.props.step.filePath}
            highlightLineNumbers={this.getLineNumbersForCurrentSection()}
          />
        </div>
        <div className="right">
          <Link to={'/'} className="tiny-logo">CodeTours</Link>&nbsp;&nbsp;|&nbsp;&nbsp;
          <Link to={this.getTourLink()}>Tour of {this.props.tour.targetRepository}</Link>
          <h1 className="step-title">{this.props.step.getFullTitle()}</h1>
          <div className="step-nav">
            {this.getPrevStepLink()}
            {this.getNextStepLink()}
          </div>
          {_.map(this.props.step.content, (section, index) => {
            return (
              <Section
                key={index}
                section={section}
                onSelect={this.onSelect.bind(this, index)}
                selected={index === this.state.selectedIndex}
                ref={component => {
                  if (index === parseInt(this.props.params.sectionIndex, 10)) {
                    this.highlightedSection = ReactDOM.findDOMNode(component);
                  }
                }}
              />
            );
          })}
          <div className="step-nav">
            {this.getPrevStepLink()}
            {this.getNextStepLink()}
          </div>
        </div>
      </div>
    );
  }
}

const loadStepWithTour = graphql(
  gql`
  query getStepWithTour($tourRepository: String!, $slug: String!) {
    step(tourRepository: $tourRepository, slug: $slug) {
      _id
      title
      slug
      codeUrl
      sections {
        slug
        lineStart
        lineEnd
        content
      }
      # asking the tour from the step leverage the cache?
      tour {
        _id
        repository
        targetRepository
      }
    }
  }
`,
  {
    options: ({ params: { user, repoName, stepSlug } }) => ({
      variables: {
        tourRepository: `${user}/${repoName}`,
        slug: stepSlug,
      },
    }),
    props: ({ data: { loading, step }, ownProps: params }) => ({
      loading,
      step,
      // patch for the time being
      tour: step && step.tour,
      params,
    }),
  }
);

// show loading component if the tour & step data are loading
const displayLoadingState = branch(
  props => props.loading,
  renderComponent(withProps(() => ({ big: true, statusId: 'loading' }))(ParrotSays))
);

// show not found component if no tour/step found
const displayNotFoundState = branch(
  props => !props.tour || !props.step,
  renderComponent(withProps(() => ({ big: true, statusId: 'not-found' }))(ParrotSays))
);

export default compose(loadStepWithTour, displayLoadingState, displayNotFoundState, pure)(Step);
