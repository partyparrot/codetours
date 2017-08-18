import { makeExecutableSchema } from 'graphql-tools';
import GraphQLDate from 'graphql-date';

import { getFile, parseMD } from './parser';

const typeDefs = `
	scalar Date

  type Query {
    tour(tourRepository: String!): Tour
  }
  
  type Tour {
    targetRepository: String!
    description: String!
    steps: [Step!]
    repository: String!
    createdAt: Date!
    failed: Boolean
  }
  
  type Step {
    title: String!
    slug: String!
    codeUrl: String!
    index: Int!
    sections: [Section!]
    user: String!
    tour: Tour!
    fullRepoName: String!
    filePath: String!
    fileUrl: String!
    code: String!
    commit: String
    previous: Step
    next: Step
  }
  
  type Section {
    slug: String
    lineStart: Int
    lineEnd: Int 
    content: String!
  }
`;

const resolvers = {
  /*
   * Custom scalar
   */
  Date: GraphQLDate,

  /*
   * Root queries
   */
  Query: {
    async tour(root, { tourRepository }, context) {
      return await importTour(tourRepository, context);
    },
  },
};

async function importTour(tourRepository, context) {
  const connector = context.github;

  let content;
  try {
    content = await getFile(connector, tourRepository, '.codetour.json');
  } catch (e) {
    if (e.statusCode === 404) {
      throw new Error(
        'not-found',
        'Could not find a .codetour.json file in the repository.'
      );
    } else {
      console.log(e); // eslint-disable-line no-console
      throw new Error('error', 'Error fetching data from GitHub.');
    }
  }

  let tour;
  try {
    tour = JSON.parse(content);
  } catch (e) {
    throw new Error('json', '.codetour.json file is not a valid JSON file.');
  }

  /*
  if (
    !Match.test(tour, {
      targetRepository: String,
      description: String,
      steps: [String],
    })
  ) {
    throw new Error(
      'invalid-config',
      `Found an invalid configuration option in .codetour.json.`
    );
  }
	*/

  tour.repository = tourRepository;
  tour.createdAt = new Date();

  // update, or insert if needed, the tour
  // context.Tours.upsert({ repository: tourRepository }, tour);

  tour.steps = await Promise.all(
    tour.steps.map((stepPath, stepIndex) => {
      let step;

      return getFile(connector, tour.repository, stepPath)
        .then(content => {
          step = {
            ...parseMD(content),
            repository: tour.repository,
            slug: stepPath,
            index: stepIndex,
          };

          return getFile(
            connector,
            step.fullRepoName,
            step.filePath,
            step.commit
          );
        })
        .then(content => {
          return (step = {
            ...step,
            code: content,
          });
        })
        .catch(e => {
          // Remove tour if it failed to import

          if (e.statusCode === 404) {
            throw new Error(
              'not-found',
              `Could not find file with path ${stepPath} in repository. Check your .codetour.json file.`
            );
          } else {
            console.log(e); // eslint-disable-line no-console
            throw new Error('error', 'Error fetching data from GitHub.');
          }
        });
    })
  );

  return tour;
}

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
