import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  parseMD(Assets.getText('sample-page.md'));
});

function parseMD(content) {
  console.log(content);
}
