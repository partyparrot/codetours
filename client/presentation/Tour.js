// Import React
import React from 'react';

// Import Spectacle Core tags
import { Deck, Heading, ListItem, List, Slide, Text, Appear } from 'spectacle';

import CodeSlide from 'spectacle-code-slide';

// Import image preloader util
import preloader from 'spectacle/lib/utils/preloader';

// Import theme
// import createTheme from "spectacle/lib/themes/default";
import theme from '../themes/seattlejs/index.js';

// Require CSS
require('normalize.css');
require('spectacle/lib/themes/default/index.css');
require('../themes/seattlejs/index.css');
// Best way to include fonts rite
require('../fonts/worksans.css');
require('../fonts/biorhyme.css');
require('../fonts/silkscreen.css');

// preloader(images);

const extractRepoInfo = fullName => fullName.split('/');

export default class Tour extends React.Component {
  render() {
    const { loading, tour } = this.props;

    if (loading) {
      return <div>Loading your tour...</div>;
    }

    const { targetRepository, repository, description, steps } = tour;

    const [, targetName] = extractRepoInfo(targetRepository);
    const [author] = extractRepoInfo(repository);

    return (
      <Deck
        transition={['zoom', 'slide']}
        transitionDuration={500}
        theme={theme}
      >
        {/* welcome slide */}
        <Slide transition={['fade']} bgColor="primary">
          <Heading size={3} lineHeight={1} textColor="secondary">
            {targetName}
          </Heading>
          <Text textColor="tertiary" size={1} caps>
            {description}
          </Text>
        </Slide>
        {/* steps overview */}
        <Slide transition={['fade']} bgColor="primary" textColor="tertiary">
          <Heading size={6} textColor="secondary" caps>
            Steps
          </Heading>
          <List ordered>
            {steps.map(({ title }) =>
              <ListItem key={`item-${title}`}>
                {title}
              </ListItem>
            )}
          </List>
        </Slide>
        {/* for each step, add a code slide with the title & code sections */}
        {steps.map(({ title, speakerNotes, filePath, code, sections }) => [
          <CodeSlide
            key={`step-${title}`}
            transition={[]}
            lang="js"
            code={code}
            bgColor="primary"
            ranges={[
              { loc: [0, 1], title, note: filePath },
              ...sections.map(section => ({
                loc: [section.lineStart - 1, section.lineEnd],
                note: section.slug,
                notes: section.speakerNotes,
              })),
            ]}
            notes={speakerNotes && speakerNotes+'?raw=true'}
          />,
        ])}
        {/* conclusion slide */}
        <Slide transition={['fade']} bgColor="primary" textColor="tertiary">
          <Heading size={6} textColor="secondary" caps>
            Recap
          </Heading>
          <List ordered>
            {steps.map(({ title }) =>
              <Appear key={`recap-${title}`}>
                <ListItem>
                  {title}
                </ListItem>
              </Appear>
            )}
          </List>
        </Slide>
      </Deck>
    );
  }
}
