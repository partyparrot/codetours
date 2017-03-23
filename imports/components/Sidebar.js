import React from 'react';
import { browserHistory, Link } from 'react-router';
import { graphql, gql } from 'react-apollo';
import { compose, withState, withHandlers, pure } from 'recompose';

const Sidebar = ({ tour, handleTourChange, handleTourSubmit }) => (
  <div className="col-sm-4">
    <h3>What's a CodeTour?</h3>
    <p>
      A CodeTour is a way for you to introduce new developers to a codebase by giving them a self-guided tour.
    </p>

    <h3>Why make a CodeTour?</h3>
    <p>
      You are hiring like crazy, and you don't want to spend hours sitting down with each new hire and walking through your codebase.
    </p>
    <p>
      You are the maintainer of a large open source project, and you want to make it super easy for people to understand how it works and contribute.
    </p>
    <p>
      You are building out a GitHub portfolio, and want to be able to highlight important parts of your projects.
    </p>
    <p>
      You are a good person and want to share and grow the world's knowledge by teaching other people how your favorite libraries and frameworks work.
    </p>

    <h3>How do I make a CodeTour?</h3>

    <p>
      <b>
        If this is your first time making a tour, take a few minutes to check out our{' '}
        <Link to="/tour/partyparrot/codetours-starter-kit">
          CodeTour for CodeTour
        </Link>
      </b>
      {' '}
      (it's meta, we know). We promise everything will make a lot more sense after taking this tour.
    </p>

    <p>If you've done it before, here's the TL;DR in case you need a reminder:</p>
    <ol>
      <li>
        Fork the{' '}
        <a href="https://github.com/partyparrot/codetours-starter-kit">starter kit</a>
        , or another existing tour
      </li>
      <li>Edit the config file, content, and code links</li>
      <li>Import your code tour here:</li>
    </ol>
    <form className="input-group" onSubmit={handleTourSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Your repository name here"
        onChange={handleTourChange}
        value={tour}
      />
      <span className="input-group-btn">
        <input type="submit" className="btn btn-success" value="Go!" />
      </span>
    </form>
  </div>
);

export default compose(
  graphql(
    gql`
    mutation importTour($tourRepository: String!) {
      importTour(tourRepository: $tourRepository) {
        _id
        targetRepository
        description
        repository
      }
    }
  `,
    {
      props: ({ mutate }) => ({
        importTour: tourRepository => mutate({
          variables: { tourRepository },
          // 'basic' update
          refetchQueries: ['getRecentTours'],
        }),
      }),
    }
  ),
  withState('tourRepository', 'updateTourInput', ''),
  withHandlers({
    handleTourChange: ({ updateTourInput }) => event => updateTourInput(event.target.value),
    handleTourSubmit: ({ tourRepository, importTour }) => async event => {
      event.preventDefault();
      try {
        const { data: { importTour: { repository } } } = await importTour(tourRepository);
        browserHistory.push(`/tour/${repository}`);
        // note: we don't care about cleaning the input, we are changing route
      } catch (error) {
        alert(error); // TODO: have a consistent way to display errors
      }
    },
  }),
  pure
)(Sidebar);
