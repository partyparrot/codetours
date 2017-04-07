import React from 'react';
import styled from 'styled-components';
import { pure, branch, renderComponent, compose } from 'recompose';
import { graphql } from 'react-apollo';

import TourBadge, { TourBadgePlaceloader } from './TourBadge';
import ParrotSays from './ParrotSays';

import RECENT_TOURS_QUERY from '../graphql/RecentTours.graphql';

export const RecentTours = ({ search, tours }) => (
  <div>
    <Title>{search ? 'Search results' : 'Recently added tours'}</Title>
    {tours.map(tour => <TourBadge tour={tour} key={tour.repository} />)}
  </div>
);

const Title = styled.h1`
  margin-bottom: 4rem;
`;

const withData = graphql(RECENT_TOURS_QUERY, {
  options: ({ search }) => ({ variables: { search } }),
  props: ({ data: { loading, tours } }) => ({ loading, tours }),
});

// show loading component if the tours data are loading
const displayLoadingState = branch(
  props => props.loading,
  renderComponent(({ search }) => (
    <div>
      <Title>{search ? 'Search results' : 'Recently added tours'}</Title>
      <TourBadgePlaceloader />
    </div>
  ))
);

// show not found component if no tours found with the current query
const displayNotFoundState = branch(
  props => !props.tours || !props.tours.length,
  renderComponent(() => <ParrotSays statusId="not-found" />)
);

export const RecentToursStatic = compose(displayLoadingState, displayNotFoundState, pure)(
  RecentTours
);

export default withData(RecentToursStatic);
