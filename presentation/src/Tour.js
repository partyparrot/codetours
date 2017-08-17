import React from 'react';
import { Deck, Heading, ListItem, List, Slide, Text } from 'spectacle';
import createTheme from 'spectacle/lib/themes/default';
import CodeSlide from 'spectacle-code-slide';

// Require CSS
require('normalize.css');
require('spectacle/lib/themes/default/index.css');

const theme = createTheme(
  {
    primary: '#122b45',
    secondary: '#fafafa',
    tertiary: '#ccc',
    quartenary: '#cc99cd',
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica',
  }
);

const extractRepoInfo = fullName => fullName.split('/');

const Tour = ({ tour, loading /* , error */ }) => {
  if (loading) {
    return (
      <Deck transition={[]} transitionDuration={0} theme={theme}>
        <Slide transition={['zoom']} bgColor="primary">
          <Heading size={1} caps lineHeight={1} textColor="secondary">
            Loading your tour...
          </Heading>
        </Slide>
      </Deck>
    );
  }

  const { targetRepository, repository, description, steps } = tour;

  const [, targetName] = extractRepoInfo(targetRepository);
  const [author] = extractRepoInfo(repository);

  return (
    <Deck transition={['zoom', 'slide']} transitionDuration={500} theme={theme}>
      {/* welcome slide */}
      <Slide transition={['fade']} bgColor="primary">
        <Heading size={3} lineHeight={1} textColor="secondary">
          {targetName}
        </Heading>
        <Text margin="10px 0 0" textColor="tertiary" size={1} caps>
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
      {steps.map(({ title, code, sections }) => [
        <CodeSlide
          key={`step-${title}`}
          transition={[]}
          lang="js"
          code={code}
          bgColor="primary"
          ranges={[
            { loc: [0, 1], title },
            ...sections.map(section => ({
              loc: [section.lineStart - 1, section.lineEnd],
              note: section.slug,
            })),
          ]}
        />,
      ])}
      {/* conclusion slide */}
      <Slide transition={['fade']} bgColor="primary">
        <Heading size={3} textColor="secondary">
          Thanks for taking this tour!
        </Heading>
        <Heading size={5} textColor="tertiary">
          Tour made by {author}
        </Heading>
      </Slide>
    </Deck>
  );
};

export default Tour;
