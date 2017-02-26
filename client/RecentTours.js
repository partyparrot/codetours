import React from 'react';
import { pure, branch, renderComponent, withProps, compose } from 'recompose';

import { createContainer } from 'meteor/react-meteor-data';

import TourBadge from './TourBadge';
import ParrotSays from './ParrotSays';

const RecentTours = ({ search, tours, toursLoaded }) => (
  <div>
    <h3>{ search ? "Search results" : "Recently added tours" }</h3>
    { tours.map(tour => <TourBadge tour={tour} key={tour.repository} />) }
  </div>
);

// load 1+ tours
const loadMeteorData = Component => createContainer(({ search }) => {
  const handleTours = Meteor.subscribe('tours');
  return {
    tours: Tours.find({ failed: { $ne: true }, targetRepository: { $regex: new RegExp(search, 'i') } }, { sort: { createdAt: - 1} }).fetch(),
    toursLoaded: handleTours.ready(),
  };
}, Component);

// show loading component if the tours data are loading
const displayLoadingState = branch(
  props => !props.toursLoaded,
  renderComponent(withProps(() => ({ statusId: 'loading' }))(ParrotSays)),
);

// show not found component if no tours found with the current query
const displayNotFoundState = branch(
  props => !props.tours.length,
  renderComponent(withProps(() => ({ statusId: 'not-found' }))(ParrotSays)),
);

export default compose(
  loadMeteorData,
  displayLoadingState,
  displayNotFoundState,
  pure
)(RecentTours);
