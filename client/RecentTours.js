import React from 'react';
import TourBadge from './TourBadge';

export default class RecentTours extends React.Component {
  render() {
    return (
      <div>
        <h3>Recently added tours</h3>
        <TourBadge />
        <TourBadge />
      </div>
    )
  }
}
