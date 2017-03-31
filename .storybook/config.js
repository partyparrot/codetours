import { configure, addDecorator } from '@kadira/storybook';
import React from 'react';
import Theme from '../imports/components/Theme';

const req = require.context('../imports/components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => <Theme>{story()}</Theme>);

configure(loadStories, module);
