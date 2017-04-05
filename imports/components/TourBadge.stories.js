import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TourBadge from './TourBadge';
import mockedData from '../../.storybook/mocks/mockedData';

const mockedTour = mockedData.Tour();

storiesOf('TourBadge', module)
  .add('on tours list', () => <TourBadge tour={mockedTour} />)
  .add('on tour page', () => <TourBadge tour={mockedTour} big />);
