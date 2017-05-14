import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TourBadge, { TourBadgePlaceloader } from './TourBadge';
import mocks from '../../../.storybook/mocks/mocks';
// patch for failing .addDecorator in storyshots config
import globalDecoratorPatch from '../../../.storybook/globalDecoratorPatch';

const mockedTour = mocks.Tour();

storiesOf('TourBadge', module)
  .addDecorator(globalDecoratorPatch)
  .add('on tours list', () => <TourBadge tour={mockedTour} />)
  .add('on tour page', () => <TourBadge tour={mockedTour} big />)
  .add('loading', () => <TourBadgePlaceloader />);
