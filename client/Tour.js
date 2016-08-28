import React from 'react';
import { Tours } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import TourBadge from './TourBadge';
import _ from 'lodash';

class Tour extends React.Component {

  getUser() {
    return this.props.tour.repository.split('/')[0];
  }

  getRepoName() {
    return this.props.tour.repository.split('/')[1];
  }

  getStepLink(step) {
    return `/tour/${this.props.tour.repository}/${step}`;
  }

  getStepTitle(slug) {
    return _.find(this.props.steps, {slug: slug}).title;
  }

  render() {
    if (!this.props.tour || !this.props.steps) {
      return <div>Loading...</div>
    }
    return (
      <div className="container">
        <TourBadge tour={this.props.tour} />
        <p>Created by {this.getUser()} for {this.props.tour.targetRepository} at {this.getRepoName()}</p>
        {
          _.map(this.props.tour.steps, (slug, index) => {
            return (
              <div key={slug}>
                <Link to={this.getStepLink(slug)}>Step {index + 1}. {this.getStepTitle(slug)}</Link>
              </div>
            );
          })
        }
        <Link to={this.getStepLink(this.props.tour.steps[0])}>Let's start</Link>
      </div>
    );
  }
}

const TourContainer = createContainer(({ params }) => {
  const repository = `${params.user}/${params.repoName}`;
  return {
    tour: Tours.findOne(
      {
        repository: repository
      }
    ),
    steps: Steps.find({
      tourName: repository
    }).fetch()
  }
}, Tour);


export default TourContainer;
