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

const loadMeteorData = Component => createContainer(({ search }) => {
  const handleTours = Meteor.subscribe('tours');
  return {
    tours: Tours.find({ failed: {$ne: true}, targetRepository: { $regex: new RegExp(search, 'i') } }, {sort: { createdAt: - 1} }).fetch(),
    toursLoaded: handleTours.ready(),
  };
}, Component);

const displayLoadingState = branch(
  props => !props.toursLoaded,
  renderComponent(withProps(() => ({ statusId: 'loading' }))(ParrotSays)),
);

const displayErrorState = branch(
  props => !props.tours,
  renderComponent(withProps(() => ({ statusId: 'not-found' }))(ParrotSays)),
);

export default compose(
  loadMeteorData,
  displayLoadingState,
  displayErrorState,
  pure
)(RecentTours);
