import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Tours } from '../collections';

// get relevant head tags from a pathname
const getHeadTags = pathname => {
  // default head tags
  const defaultHead = {
    title: 'CodeTours',
    description: 'Introduce yourself to new and exciting open source codebases.',
    image: Meteor.absoluteUrl('background.jpeg'),
  };

  // if the route isn't related to a tour, fallback to default head tags
  if (!pathname.includes('/tour/')) {
    return defaultHead;
  }

  // get the current tour data
  // note: at the moment we always have all the tours
  // (publish all tours or server-side with complete access to the db)
  const tour = Tours.findOne({ repository: pathname.slice(6) });

  // no tour found, return default head tags
  if (!tour) {
    return defaultHead;
  }

  // usernames of the author and the target repo
  const authorUsername = tour.repository.split('/')[0];
  const targetRepoUsername = tour.targetRepository.split('/')[0];

  // tour related head tags
  return {
    title: `Tour of ${tour.targetRepository}, led by ${authorUsername}`,
    description: tour.description,
    image: `https://github.com/${targetRepoUsername}.png`,
  };
};

const Headtags = ({ pathname } = { pathname: '/' }) => {
  const headTags = getHeadTags(pathname);

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
  pathname: PropTypes.string,
};

export default Headtags;
