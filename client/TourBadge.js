import React from 'react';

export default class TourBadge extends React.Component {
  render() {
    const { tour } = this.props;
    const targetRepo = tour.targetRepository;
    const targetUsername = targetRepo.split('/')[0];

    return (
      <div className="tour-badge">
        <img src={`https://github.com/${targetUsername}.png`}/>
        <h4 className="target-repo">{targetRepo}</h4>
        <p className="tour-title">{tour.description}</p>
        <p className="tour-credits">
          Contribute at <a href={`https://github.com/${tour.repository}`}>{tour.repository}</a>
        </p>
      </div>
    )
  }
}
