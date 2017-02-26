import React, { PropTypes } from 'react';

const statusList = [
  { id: 'loading', gif: 'triplets', caption: 'Loading...' },
  { id: 'not-found', gif: 'confused', caption: 'No tour found!' },
];

export default ParrotSays = ({ big = false, statusId = 'loading' }) => {
  
  const { gif, caption } = statusList.find(status => status.id === statusId);
  
  return (
    <div className={`parrot ${big && "parrot--big"}`}>
      <img className="parrot-gif" src={`/${gif}parrot.gif`} />
      <div className="parrot-title">
        { caption }
      </div>
    </div>
  );
};

ParrotSays.propTypes = {
  big: PropTypes.bool,
  status: PropTypes.oneOf(['loading', 'not-found']),
};
