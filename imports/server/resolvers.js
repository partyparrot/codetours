import GraphQLDate from 'graphql-date';
import importTour from './mutations';

const resolvers = {
  /*
   * Custom scalar
   */
  Date: GraphQLDate,

  /*
   * Root queries
   */
  Query: {
    async tours(root, { search, limit = 0 }, context) {
      return await context.Tours
        .find(
          { failed: { $ne: true }, targetRepository: { $regex: new RegExp(search, 'i') } },
          { sort: { createdAt: -1 }, limit }
        )
        .fetch();
    },
    async tour(root, { tourRepository: repository }, context) {
      return await context.Tours.findOne({ repository });
    },
    async steps(root, { tourRepository: repository }, context) {
      return await context.Steps.find({ repository }).fetch();
    },
    async step(root, { tourRepository: repository, slug }, context) {
      return await context.Steps.findOne({ repository, slug });
    },
  },

  /*
   * Root mutations
   */
  Mutation: {
    async importTour(root, { tourRepository: repository }, context) {
      await importTour(repository, context);
      return await context.Tours.findOne({ repository });
    },
  },

  /*
   * Types resolvers
   */
  Tour: {
    async steps({ steps }, args, context) {
      // note: we preserve the steps order as registered in the tour
      return await Promise.all(steps.map(slug => context.Steps.findOne({ slug })));
    },
  },
  Step: {
    async tour({ repository }, args, context) {
      return await context.Tours.findOne({ repository });
    },
    async previous({ repository, index }, args, context) {
      return index === 0 ? null : await context.Steps.findOne({ repository, index: index - 1 });
    },
    async next({ repository, index }, args, context) {
      return await context.Steps.findOne({ repository, index: index + 1 });
    },
  },
};

export default resolvers;
