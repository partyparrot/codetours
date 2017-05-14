import { PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';

export const shimmer = keyframes`
  from {
      background-position: -46.8rem 0
  }
  to {
      background-position: 4.68rem 0
  }
`;

const Placeloader = styled.div`
  animation: 1s linear infinite forwards ${shimmer};
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 100rem 10.4rem;
  overflow: hidden;
  width: ${props => props.width};
  height: ${props => props.height};
  ${props => props.marginBottom && `margin-bottom: ${props.marginBottom}`};
  ${props => props.marginRight && `margin-right: ${props.marginRight}`};
`;

Placeloader.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  marginBottom: PropTypes.string,
  marginRight: PropTypes.string,
};

export default Placeloader;
