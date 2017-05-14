import * as data from './fakeData';

const mocks = {
  Query: () => ({
    // reproduce the behavior of the `tours` resolver (mongo query)
    tours: (root, { search = '' }) =>
      [data.demoTour, data.otherTour].filter(tour =>
        tour.targetRepository.match(new RegExp(search, 'i'))),
  }),
  // note: pass a copy of the data to avoid `apollo-test-utils` to mutate
  // the data object!
  Tour: () => ({ ...data.demoTour }),
  Step: () => ({ ...data.demoFirstStep }),
};

export default mocks;
