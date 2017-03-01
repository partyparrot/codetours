export const Tours = new Mongo.Collection('tours');
export const Steps = new Mongo.Collection('steps');
import _ from 'lodash';

Tours.helpers({
  getSteps() {
    const allSteps = _.keyBy(
      Steps.find({
        tourName: this.repository,
      }).fetch(),
      'slug'
    );

    // Sort the steps we got by the array
    return this.steps.map(slug => allSteps[slug]);
  },
});

Steps.helpers({
  getTour() {
    return Tours.findOne({
      repository: this.tourName,
    });
  },

  getFullTitle() {
    const stepNum = _.indexOf(this.getTour().steps, this.slug) + 1;
    return `${stepNum}. ${this.title}`;
  },

  getPrevStep() {
    const tour = this.getTour();
    const index = _.indexOf(tour.steps, this.slug);
    return Steps.findOne({ slug: tour.steps[index - 1] });
  },

  getNextStep() {
    const tour = this.getTour();
    const index = _.indexOf(tour.steps, this.slug);
    return Steps.findOne({ slug: tour.steps[index + 1] });
  },
});

if (typeof window !== 'undefined') {
  window.Tours = Tours;
  window.Steps = Steps;
}
