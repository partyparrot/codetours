import { Meteor } from 'meteor/meteor';

const stagesPrinted = {};

export default function printTime(stage) {
  if (!Meteor.isClient || stagesPrinted[stage]) {
    return;
  }

  var now = new Date().getTime();
  var page_load_time = now - performance.timing.navigationStart;

  console.log(`[Timing] ${stage}: ${page_load_time}`); // eslint-disable-line no-console

  stagesPrinted[stage] = true;
}
