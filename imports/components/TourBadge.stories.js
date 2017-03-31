import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TourBadge from './TourBadge';

const mockedTour = {
  _id: 'CdkePNS3c558dTg67',
  targetRepository: 'partyparrot/codetours-starter-kit',
  description: "Start here when you're making a code tour!",
  steps: ['my-first-step.md', 'markdown.md'],
  repository: 'partyparrot/codetours-starter-kit',
  createdAt: '2016-08-28T18:26:27.834Z',
};

storiesOf('TourBadge', module)
  .add('on tours list', () => <TourBadge tour={mockedTour} />)
  .add('on tour page', () => <TourBadge tour={mockedTour} big />);
