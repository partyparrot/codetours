import { Meteor } from 'meteor/meteor';
import { Tours, Steps } from '../collections';

Meteor.publish({
  tours() {
    // just publish all tours
    return Tours.find();
  },
  steps(tourName) {
    return Steps.find({ tourName });
  },
});
