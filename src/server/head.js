import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import { Tours } from '../collections';

// default head tags
// note: to be exported?
const defaultHead = {
  title: 'CodeTours',
  description: 'Introduce yourself to new and exciting open source codebases.',
  image: Meteor.absoluteUrl('background.jpeg'),
};

// get relevant head tags from an url
// note: to be exported?
const getHeadTags = url => {
  // if the route isn't related to a tour, fallback to default head tags
  if (!url.includes('/tour/')) {
    return defaultHead;
  }

  // get the current tour data
  const tour = Tours.findOne({ repository: url.slice(6) });

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

// connect handler middleware to server-side render the head tags
const serverRendering = (req, res, next) => {
  // get head tags from relative path
  const headTags = getHeadTags(req.originalUrl);

  // generate the twitter meta tags
  const meta = [
    { name: 'twitter:card', content: 'summary' },
    ...Object.keys(headTags).map(tagName => ({
      name: `twitter:${tagName}`,
      content: headTags[tagName],
    })),
  ];

  // plug default link tags to the head
  const link = [
    {
      rel: 'stylesheet',
      href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/styles/github-gist.min.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Pacifico',
    },
    {
      rel: 'stylesheet',
      href: '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css',
    },
    { rel: 'icon', href: '/icon.png' },
  ];

  // helmet head tags \o/
  const component = (
    <div>
      <Helmet title={headTags.title} meta={meta} link={link} />
    </div>
  );

  // render
  req.dynamicBody = ReactDOM.renderToStaticMarkup(component);

  const head = Helmet.rewind();
  req.dynamicHead = `
    ${head.title.toString()}
    ${head.meta.toString()}
    ${head.link.toString()}
  `;

  next();
};

WebApp.connectHandlers.use(serverRendering);
