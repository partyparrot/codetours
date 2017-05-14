import { storiesOf } from '@kadira/storybook';
import React from 'react';
import Header from './Header';
// patch for failing .addDecorator in storyshots config
import globalDecoratorPatch from '../../../.storybook/globalDecoratorPatch';

storiesOf('Header', module)
  .addDecorator(globalDecoratorPatch)
  .add('with background image', () => <Header />)
  .add('with radial gradient', () => <Header withGradient />);
