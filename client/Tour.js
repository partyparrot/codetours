import React from 'react';
import { pure, branch, renderComponent, withProps, compose } from 'recompose';
import { Link } from 'react-router';
import _ from 'lodash';

import { Tours } from '../collections';
import { createContainer } from 'meteor/react-meteor-data';

import TourBadge from './TourBadge';
import Navbar from './Navbar';
import ParrotSays from './ParrotSays';


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
    debugger
    return (
      <div>
        <Navbar />
        <div className="container" style={{marginTop: "40px"}}>

          <div className="row" style={{marginTop: "40px"}}>
            <div className="col-md-2 col-xs-2">
              <img style={{maxWidth: "80%"}} src={`https://github.com/${this.props.tour.targetRepository.split('/')[0]}.png`}/>
            </div>
            <div className="col-md-10 col-xs-10">
              <h1 className="target-repo">
                <span className="text-muted" style={{fontWeight: "normal"}}>Tour of </span>
                {this.props.tour.targetRepository}
                <span className="text-muted" style={{fontWeight: "normal"}}>, led by&nbsp;
                  <a href={`https://github.com/${this.getUser()}`}>{this.getUser()}</a>
                </span>
              </h1>
              <p style={{fontSize: "20px"}}>{this.props.tour.description}</p>
            </div>
          </div>

          <div className="row" style={{marginTop: "20px"}}>
            <div className="col-md-8">
              <Link to={this.getStepLink(this.props.tour.steps[0])} style={{textDecoration: "none"}}>
                <button
                  type="button"
                  className="btn btn-success btn-lg btn-block"
                  style={{fontWeight: "bold"}}>
                  Start CodeTour
                </button>
              </Link>
              {
                this.props.stepsLoaded
                  ? _.map(this.props.tour.steps, (slug, index) => {
                    return (
                      <div key={slug}>
                        <Link to={this.getStepLink(slug)}>
                          <div className="row" style={{marginTop: "10px"}}>
                            <div className="col-sm-3 col-xs-3 number-circle">{index + 1}</div>
                            <div
                              className="col-sm-7 col-xs-7"
                              style={{textAlign: "middle", lineHeight: "50px", fontSize: "20px", padding: "6px"}}>
                              {this.getStepObject(slug) && this.getStepObject(slug).title}</div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                : <ParrotSays statusId="loading" big />
              }
            </div>

            <div className="col-md-4"
              style={{backgroundColor: "#f7f7f9", borderRadius: "4px", border: "1px solid #e1e1e8", padding: "5px", paddingBottom: "15px"}}>

              <div style={{fontSize: "16px", padding: "5px"}}>
                <p>This is a tour of <a href={`https://github.com/${this.props.tour.targetRepository}`}>
                  {this.props.tour.targetRepository}</a>, led by <a href={`https://github.com/${this.getUser()}`}>{this.getUser()}</a>.
                </p>
                <p>
                  <a href={`https://github.com/${this.getUser()}/${this.getRepoName()}`}>
                    Contribute, create a fork, or file issues on Github
                  </a>
                </p>
              </div>
              <button className="btn btn-default" onClick={this.reImportTour}>
                <span className="glyphicon glyphicon-refresh" />&nbsp;
                Sync CodeTour from Github
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const loadMeteorData = Component => createContainer(({ params }) => {
  const repository = `${params.user}/${params.repoName}`;
  const handleTours = Meteor.subscribe('tours');
  const handleSteps = Meteor.subscribe('steps', repository);
  return {
    tour: Tours.findOne({ repository: repository }),
    toursLoaded: handleTours.ready(),
    steps: Steps.find({ tourName: repository }).fetch(),
    stepsLoaded: handleSteps.ready(),
  }
}, Component);

const displayLoadingState = branch(
  props => !props.toursLoaded,
  renderComponent(withProps(() => ({ big: true, statusId: 'loading' }))(ParrotSays)),
);

const displayErrorState = branch(
  props => !props.tour,
  renderComponent(withProps(() => ({ big: true, statusId: 'not-found' }))(ParrotSays)),
);

export default compose(
  loadMeteorData,
  displayLoadingState,
  displayErrorState,
  pure
)(Tour);
