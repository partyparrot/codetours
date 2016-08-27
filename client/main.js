import React from 'react';
import ReactDOM from 'react-dom';
import Snippet from './Snippet';


Meteor.startup(() => {
  ReactDOM.render((
    <App />
  ), document.getElementById('root'));
});

class App extends React.Component {
  render() {
    return (
      <div>
        <Snippet />
      </div>
    );
  }
}
