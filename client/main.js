import React from 'react';
import ReactDOM from 'react-dom';
import Snippet from './Snippet';


Meteor.startup(() => {
  ReactDOM.render((
    <App />
  ), document.getElementById('root'));
});

const code = `
const rootResolvers = {
  Query: {
    feed(_, { type, offset, limit }, context) {
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;

      return context.Entries.getForFeed(type, offset, protectedLimit);
    },
    entry(_, { repoFullName }, context) {
      return context.Entries.getByRepoFullName(repoFullName);
    },
    currentUser(_, __, context) {
      return context.user || null;
    },
  },
`;

class App extends React.Component {
  render() {
    return (
      <div>
        <Snippet code={code} startLineNumber={10} highlightLineNumbers={[15, 16, 17, 18, 22, 23]}/>
      </div>
    );
  }
}
