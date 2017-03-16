import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';

import './server-rendering';

import typeDefs from './schema';
import resolvers from './resolvers';
import * as connectors from './connectors';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
  context: connectors,
});
