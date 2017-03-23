import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';
import './server-rendering';

import typeDefs from './schema';
import resolvers from './resolvers';

import { Tours, Steps } from '../collections';
import { GitHubConnector } from './github';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
  context: {
    github: new GitHubConnector(),
    Tours,
    Steps,
  },
});
