import { storiesOf } from '@kadira/storybook';
import React from 'react';
// patch for failing .addDecorator in storyshots config
import globalDecoratorPatch from '../../.storybook/globalDecoratorPatch';
import RecentTours from './RecentTours';

// note:
// how to test loading and not found states?
// by exporting the component without the data hoc?

// note: the stories are working but the storyshots are on loading...
storiesOf('RecentTours', module)
  .addDecorator(globalDecoratorPatch)
  .add('with tours', () => <RecentTours />)
  .add('with specific search', () => <RecentTours search="party" />);
