import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Meteor } from 'meteor/meteor';

// get relevant head tags
const getHeadTags = tour => {
  // default head tags
  const defaultHead = {
    title: 'CodeTours',
    description: 'Introduce yourself to new and exciting open source codebases.',
    image: Meteor.absoluteUrl('background.jpeg'),
  };

  // if the route isn't related to a tour, fallback to default head tags
  if (!tour) {
    return defaultHead;
  }

  // usernames of the author and the target repo
  const [authorUsername] = tour.repository.split('/');
  const [targetRepoUsername] = tour.targetRepository.split('/');

  // tour related head tags
  return {
    title: `Tour of ${tour.targetRepository}, led by ${authorUsername}`,
    description: tour.description,
    image: `https://github.com/${targetRepoUsername}.png`,
  };
};

const Headtags = ({ tour }) => {
  const headTags = getHeadTags(tour);

  // generate the twitter meta tags
  const meta = [
    { name: 'twitter:card', content: 'summary' },
    // from the relevant tags names, create twitter meta in "helmet-shape"
    ...Object.keys(headTags).map(tagName => ({
      name: `twitter:${tagName}`,
      content: headTags[tagName],
    })),
  ];

  return <Helmet title={headTags.title} meta={meta} />;
};

Headtags.propTypes = {
  tour: PropTypes.shape({
    repository: PropTypes.string.isRequired,
    targetRepository: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
};

export default Headtags;
