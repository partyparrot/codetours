import { storiesOf } from '@kadira/storybook';
import React from 'react';
import ContentControllers from './ContentControllers';
// patch for failing .addDecorator in storyshots config
import globalDecoratorPatch from '../../.storybook/globalDecoratorPatch';

storiesOf('ContentControllers', module)
  .addDecorator(globalDecoratorPatch)
  .add('left selected', () => (
    <ContentControllers
      left={{
        title: 'Show tours',
        selected: true,
      }}
      right={{
        title: "What's that?",
        selected: false,
      }}
    />
  ))
  .add('right selected', () => (
    <ContentControllers
      left={{
        title: 'Show tours',
        selected: false,
      }}
      right={{
        title: "What's that?",
        selected: true,
      }}
    />
  ));
