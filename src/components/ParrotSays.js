import React, { PropTypes } from 'react';

// hardcoded list of available statuses
const statusList = [
  { id: 'loading', gif: 'triplets', caption: 'Loading...' },
  { id: 'not-found', gif: 'confused', caption: 'No tour found!' },
];

export default (ParrotSays = ({ statusId = 'loading', big = false }) => {
  const { gif, caption } = statusList.find(status => status.id === statusId);

  return (
    <div className={`parrot ${big && 'parrot--big'}`}>
      <img className="parrot-gif" src={`/${gif}parrot.gif`} />
      <div className="parrot-title">
        {caption}
      </div>
    </div>
  );
});

ParrotSays.propTypes = {
  statusId: PropTypes.oneOf(statusList.map(status => status.id)).isRequired,
  big: PropTypes.bool,
};
