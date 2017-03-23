import GraphQLDate from 'graphql-date';
import importTour from './mutations';

const resolvers = {
  Date: GraphQLDate,
  Query: {
    async tours(root, { search, limit = 0 }, context) {
      return await context.Tours
        .find(
          { failed: { $ne: true }, targetRepository: { $regex: new RegExp(search, 'i') } },
          { sort: { createdAt: -1 }, limit }
          // TODO no need of fetch if using a connector?
        )
        .fetch();
    },
    async tour(root, { tourRepository }, context) {
      return await context.Tours.findOne({
        repository: tourRepository,
      });
    },
    async steps(root, { tourRepository }, context) {
      return await context.Steps.find({ tourName: tourRepository }).fetch();
    },
    async step(root, { tourRepository, slug }, context) {
      return await context.Steps.findOne({
        tourName: tourRepository,
        slug,
      });
    },
  },
  Mutation: {
    async importTour(root, { tourRepository }, context) {
      await importTour(tourRepository, context);
      return await context.Tours.findOne({ repository: tourRepository });
    },
  },
  Tour: {
    async steps(tour, args, context) {
      // note: doing like this return steps without the original order
      // return await context.Steps.find({ tourName: tour.repository }).fetch();

      // TODO inconsistency here on slugs / steps
      const stepsData = tour.steps.map(slug => context.Steps.findOne({ slug }));

      return await Promise.all(stepsData);
    },
  },
  Step: {
    async tour(step, args, context) {
      // TODO inconsistency here on tour name
      return await context.Tours.findOne({ repository: step.tourName });
    },
    sections(step) {
      // TODO inconsistency here on field name
      return step.content;
    },
  },
};

export default resolvers;
