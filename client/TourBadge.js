import React from 'react';

export default class TourBadge extends React.Component {
  render() {
    return (
      <div className="tour-badge">
        <img src="https://github.com/facebook.png"/>
        <h4 className="target-repo">facebook/react</h4>
        <p className="tour-title">{"A walkthrough of React's reconciliation algorithm."}</p>
        <p className="tour-credits">Contribute at <a href="#">dan_abramov/facebook-tour</a></p>
      </div>
    )
  }
}
