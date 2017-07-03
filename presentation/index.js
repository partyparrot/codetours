import React from 'react';
import { ApolloProvider, ApolloClient, createNetworkInterface, graphql } from 'react-apollo';

import Tour from './Tour';

// fancy!
import TOUR_QUERY from './tour.graphql';

const TourWithData = graphql(TOUR_QUERY, {
  options: ({ tourRepository }) => ({ variables: { tourRepository } }),
  props: ({ data: { tour, loading, error } }) => ({
    tour,
    loading,
    error,
  }),
})(Tour);

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    // === CodeTours GraphQL server
    uri: 'https://ljk3vj7pq.lp.gql.zone/graphql',
  }),
});

export default () =>
  <ApolloProvider client={client}>
    <TourWithData tourRepository="xavcz/codetours-starter-kit-v2" />
  </ApolloProvider>;
