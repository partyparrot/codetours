import React from 'react';
import { Tours } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import TourBadge from './TourBadge';

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
  
  render() {
    if (!this.props.tour) {
      return <div>Loading...</div>
    }
    return (
      <div className="container">
        <TourBadge tour={this.props.tour} />
        <p>Created by {this.getUser()} for {this.props.tour.targetRepository} at {this.getRepoName()}</p>
        {
          _.map(this.props.tour.steps, (step, index) => {
            return (
              <div key={step}>
                <Link to={this.getStepLink(step)}>Step {index + 1}. {step}</Link>
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
    )
  }
}, Tour);


export default TourContainer;
