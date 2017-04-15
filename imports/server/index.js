import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';
import OpticsAgent from 'optics-agent';

import typeDefs from './schema';
import resolvers from './resolvers';

import { Tours, Steps } from '../collections';
import { GitHubConnector } from './github';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

OpticsAgent.instrumentSchema(schema);

createApolloServer(
  req => ({
    schema,
    context: {
      github: new GitHubConnector(),
      Tours,
      Steps,
      opticsContext: OpticsAgent.context(req),
    },
  }),
  {
    configServer: server => {
      server.use('/graphql', OpticsAgent.middleware());
    },
  }
);
