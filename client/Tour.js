import React from 'react';
import { Tours } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';


class Tour extends React.Component {

  getUser() {
    return this.props.tour.repository.split('/')[0];
  }

  getRepoName() {
    return this.props.tour.repository.split('/')[1];
  }

  render() {
    if (!this.props.tour) {
      return <div>Loading...</div>
    }
    return (
      <div className="container">
        <h1>CodeTour - {this.props.tour.title}</h1>
        <p>Created by {this.getUser()} for TARGET_REPO at {this.getRepoName()}</p>
        {
          _.map(this.props.tour.steps, (step, index) => {
            return (<p key={index}>Step {index + 1}. {step}</p>);
          })
        }
        <a href={`/tour/${this.props.tour.repository}/${this.props.tour.steps[0]}`}>Let's start</a>
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
