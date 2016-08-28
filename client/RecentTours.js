import React from 'react';
import TourBadge from './TourBadge';
import { createContainer } from 'meteor/react-meteor-data';

class RecentTours extends React.Component {
  render() {
    return (
      <div>
        <h3>{ this.props.search ? "Search results" : "Recently added tours" }</h3>
        { this.props.tours.map(tour => <TourBadge tour={tour} key={tour.repository} /> ) }
      </div>
    )
  }
}

export default createContainer(({ search }) => {
  return {
    tours: Tours.find({ targetRepository: { $regex: new RegExp(search, 'i') } }, {sort: { createdAt: - 1} })
      .fetch()
      .filter((tour) => !tour.failed),
  };
}, RecentTours);
