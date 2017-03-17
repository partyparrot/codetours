import React from 'react';
import { pure, branch, renderComponent, withProps, compose } from 'recompose';
import { graphql, gql } from 'react-apollo';

import TourBadge from './TourBadge';
import ParrotSays from './ParrotSays';

// import printTime from '../printTime';

const RecentTours = ({ search, data: { tours } }) => (
  <div>
    <h3>{search ? 'Search results' : 'Recently added tours'}</h3>
    {tours.map(tour => <TourBadge tour={tour} key={tour.repository} />)}
  </div>
);

const loadTours = graphql(
  gql`
  query getRecentTours($search: String) {
    tours(search: $search) {
      _id
      targetRepository
      description
      repository
    }
  }
`,
  {
    options: ({ search }) => ({ variables: { search } }),
  }
);

// show loading component if the tours data are loading
const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(withProps(() => ({ statusId: 'loading' }))(ParrotSays))
);

// show not found component if no tours found with the current query
const displayNotFoundState = branch(
  props => !props.data.tours.length,
  renderComponent(withProps(() => ({ statusId: 'not-found' }))(ParrotSays))
);

export default compose(loadTours, displayLoadingState, displayNotFoundState, pure)(RecentTours);
