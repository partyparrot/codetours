export const Tours = new Mongo.Collection('tours');
export const Steps = new Mongo.Collection('steps');
import _ from 'lodash';

Tours.helpers({
  getSteps() {
    const allSteps = _.keyBy(Steps.find({
      tourName: this.repository,
    }).fetch(), 'slug');

    // Sort the steps we got by the array
    return this.steps.map(slug => allSteps[slug]);
  }
})

if (typeof window !== 'undefined') {
  window.Tours = Tours;
  window.Steps = Steps;
}
