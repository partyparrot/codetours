import React from 'react';
import { Tours } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import TourBadge from './TourBadge';
import _ from 'lodash';

class Tour extends React.Component {
  constructor(props) {
    super(props);
    this.reImportTour = this.reImportTour.bind(this);
  }

  getUser() {
    return this.props.tour.repository.split('/')[0];
  }

  getRepoName() {
    return this.props.tour.repository.split('/')[1];
  }

  getStepLink(step) {
    return `/tour/${this.props.tour.repository}/${step}`;
  }

  getStepObject(slug) {
    return _.find(this.props.steps, {slug: slug});
  }

  reImportTour() {
    event.preventDefault();
    const tourRepository = this.props.tour.repository;
    Meteor.call('importTour', tourRepository, (err, res) => {
      if (err) {
        alert(err.reason);
      }
    });
  }

  render() {
    if (!this.props.stepsLoaded) {
      return <div>Loading...</div>
    }
    return (
      <div className="container">
        <TourBadge tour={this.props.tour} />
        <button onClick={this.reImportTour}>Reload from GitHub source</button>
        <p>Created by {this.getUser()} for {this.props.tour.targetRepository} at {this.getRepoName()}</p>
        {
          _.map(this.props.tour.steps, (slug, index) => {
            return (
              <div key={slug}>
                <Link to={this.getStepLink(slug)}>{this.getStepObject(slug).getFullTitle()}</Link>
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
  const handle = Meteor.subscribe('steps', repository);
  return {
    tour: Tours.findOne(
      {
        repository: repository
      }
    ),
    steps: Steps.find({
      tourName: repository
    }).fetch(),
    stepsLoaded: handle.ready(),
  }
}, Tour);


export default TourContainer;
