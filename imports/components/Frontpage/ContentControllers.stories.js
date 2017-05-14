import { storiesOf, action } from '@kadira/storybook';
import React from 'react';
import ContentControllers from './ContentControllers';
// patch for failing .addDecorator in storyshots config
import globalDecoratorPatch from '../../../.storybook/globalDecoratorPatch';

const toggleControllerMock = value => action(`toggle ${value}`);

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
      toggleController={toggleControllerMock}
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
      toggleController={toggleControllerMock}
    />
  ));
