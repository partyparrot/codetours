import React from 'react';
import TourBadge from './TourBadge';
import { createContainer } from 'meteor/react-meteor-data';

class RecentTours extends React.Component {
  render() {
    return (
      <div>
        <h3>Recently added tours</h3>
        { this.props.tours.map(tour => <TourBadge tour={tour} key={tour.repository} /> ) }
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    tours: Tours.find().fetch(),
  };
}, RecentTours);
