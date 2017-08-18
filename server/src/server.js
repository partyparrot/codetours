import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { schema } from './schema';
import { context } from './context';

const PORT = 8080;
const server = express();

if (typeof process.env.GITHUB_CLIENT_ID === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_CLIENT_ID is not defined. Check README.md for more information'
  );
}
if (typeof process.env.GITHUB_CLIENT_SECRET === 'undefined') {
  console.warn(
    'WARNING: process.env.GITHUB_CLIENT_SECRET is not defined. Check README.md for more information'
  );
}

server.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  graphqlExpress(request => ({
    schema,
    context: context(request.headers, process.env),
  }))
);

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    query: `query tour($tourRepository: String!) {
  tour(tourRepository: $tourRepository) {
    # which one is which?
    repository
    targetRepository
    description
    steps {
      title
      speakerNotes
      # filePath
      # slug
      # code
      sections {
        note
        lineStart
        lineEnd
        speakerNotes
      }
    }
  }
}
`,
  })
);

server.listen(PORT, () => {
  console.log(
    `GraphQL Server is now running on http://localhost:${PORT}/graphql`
  );
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
