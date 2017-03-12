import { Meteor } from 'meteor/meteor';

export default function execRegexOrThrow(re, str) {
  const result = re.exec(str);

  if (!result) {
    throw new Meteor.Error('format', `${str} didn't match required format: ${re}`);
  }

  return result;
}
