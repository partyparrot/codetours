import React, { PropTypes } from 'react';

export default Loading = ({ big }) => ( 
  <div className={`loading ${big && "loading--big"}`}>
    <img className="loading-parrot" src="/tripletsparrot.gif" />
    <div className="loading-title">
      Loading...
    </div>
  </div>
);

Loading.propTypes = {
  big: PropTypes.bool,
};
