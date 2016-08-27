import React from 'react';
import ReactDOM from 'react-dom';
import PageContainer from './Page';

Meteor.startup(() => {
  ReactDOM.render((
    <App />
  ), document.getElementById('root'));
});

class App extends React.Component {
  render() {
    return (
      <div>
        <PageContainer />
      </div>
    );
  }
}
