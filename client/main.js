import React from 'react';
import ReactDOM from 'react-dom';

Meteor.startup(() => {
  ReactDOM.render((
    <div>Hello world 2!</div>
  ), document.getElementById('root'));
});
