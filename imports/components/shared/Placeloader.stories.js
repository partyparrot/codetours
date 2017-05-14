import { storiesOf } from '@kadira/storybook';
import React from 'react';
import Placeloader from './Placeloader';

storiesOf('Placeloader', module).add('square of 100x100 pixels', () => (
  <Placeloader width="10rem" height="10rem" />
));
