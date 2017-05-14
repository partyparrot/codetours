import React from 'react';
import { pure, branch, renderComponent, compose } from 'recompose';
import { Link } from 'react-router';
import { graphql } from 'react-apollo';

import Headtags from '../shared/Headtags';
import TourBadge from '../shared/TourBadge';
import ParrotSays from '../shared/ParrotSays';
import Navbar from './Navbar';

import TOUR_QUERY from '../../graphql/Tour.graphql';
import TOUR_MUTATION from '../../graphql/ImportTour.graphql';

class Tour extends React.Component {
  constructor(props) {
    super(props);
    this.reImportTour = this.reImportTour.bind(this);
  }

  getStepLink(step) {
    return `/tour/${this.props.tour.repository}/${step}`;
  }

  async reImportTour() {
    event.preventDefault();
    try {
      await this.props.importTour();
    } catch (error) {
      alert(error);
    }
  }

  render() {
    const { tour } = this.props;

    const [tourAuthor] = tour.repository.split('/');

    return (
      <div>
        <Headtags tour={tour} />
        <Navbar />
        <div className="container" style={{ marginTop: '40px' }}>

          <TourBadge tour={tour} big />

          <div className="row" style={{ marginTop: '20px' }}>
            <div className="col-md-8">
              <Link to={this.getStepLink(tour.steps[0].slug)} style={{ textDecoration: 'none' }}>
                <button
                  type="button"
                  className="btn btn-success btn-lg btn-block"
                  style={{ fontWeight: 'bold' }}
                >
                  Start CodeTour
                </button>
              </Link>
              {tour.steps.map(step => (
                <div key={step._id}>
                  <Link to={this.getStepLink(step.slug)}>
                    <div className="row" style={{ marginTop: '10px' }}>
                      <div className="col-sm-3 col-xs-3 number-circle">
                        {step.index + 1}
                      </div>
                      <div
                        className="col-sm-7 col-xs-7"
                        style={{
                          textAlign: 'middle',
                          lineHeight: '50px',
                          fontSize: '20px',
                          padding: '6px',
                        }}
                      >
                        {step.title}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div
              className="col-md-4"
              style={{
                backgroundColor: '#f7f7f9',
                borderRadius: '4px',
                border: '1px solid #e1e1e8',
                padding: '5px',
                paddingBottom: '15px',
              }}
            >

              <div style={{ fontSize: '16px', padding: '5px' }}>
                <p>
                  This is a tour of <a href={`https://github.com/${tour.targetRepository}`}>
                    {tour.targetRepository}
                  </a>
                  , led by{' '}
                  <a href={`https://github.com/${tourAuthor}`}>{tourAuthor}</a>
                  .
                </p>
                <p>
                  <a href={`https://github.com/${tour.repository}`}>
                    Contribute, create a fork, or file issues on Github
                  </a>
                </p>
              </div>
              <button className="btn btn-default" onClick={this.reImportTour}>
                <span className="glyphicon glyphicon-refresh" />&nbsp;
                Sync CodeTour from Github
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const withTour = graphql(TOUR_QUERY, {
  options: ({ params: { user, repoName } }) => ({
    variables: { tourRepository: `${user}/${repoName}` },
  }),
  props: ({ data: { loading, tour }, ownProps: { location } }) => ({
    loading,
    tour,
    location,
  }),
});

// show loading component if the tour & steps data are loading
const displayLoadingState = branch(
  props => props.loading,
  renderComponent(() => <ParrotSays statusId="loading" big />)
);

// show not found component if no tour found or no steps found for this tour
const displayNotFoundState = branch(
  props => !props.tour || !props.tour.steps.length,
  renderComponent(() => <ParrotSays statusId="not-found" big />)
);

// add mutation hoc after the other hoc: the tour is actually there
const withMutation = graphql(TOUR_MUTATION, {
  props: ({ ownProps: { tour: { repository } }, mutate }) => ({
    importTour: () => mutate({
      variables: { tourRepository: repository },
    }),
  }),
});

export default compose(withTour, displayLoadingState, displayNotFoundState, withMutation, pure)(
  Tour
);
