import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { small, mediumLarge } from './lib/styleHelpers';

// note: provide invariant if somehow both are selected or none is selected
const ContentControllers = ({ left, right }) => (
  <Wrapper>
    <Controller selected={left.selected}>{left.title}</Controller>
    <Controller selected={right.selected}>{right.title}</Controller>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  
  *:first-child {
    margin-right: 1rem;
  }
  
  *:last-child {
    margin-left: 1rem;
  }
`;

const Controller = styled.button`
  ${small`
    flex-grow: 1;
  `}
  padding: 1rem 2rem;
  
  background: ${props => props.selected ? props.theme.blue : props.theme.grey};
  text-transform: uppercase;
  color: ${props => props.theme.light};
  font-weight: 700;
  border: 0;
  position: relative;
  
  &:after {
    transition: top 150ms ease-in-out;
    content: '';
    display: block;
    position: absolute;
    top: ${props => props.selected ? '100%' : '65%'};
    ${small`
      left: 48%;
    `}
    ${mediumLarge`
      left: 42%;
    `}
    width: 0;
    height: 0;
    border: 1rem solid transparent;
    border-top-color: ${props => props.selected ? props.theme.blue : props.theme.grey};
  }
  
  &:hover:after, &:active:after {
    top: 100%;
    ${props => !props.selected && `border-top-color: ${props.theme.darkerBlue}`};
  }
  
  &:hover, &:active {
    ${props => !props.selected && `background: ${props.theme.darkerBlue}`};
  }
  
  &:focus {
    outline: 0;
  }
`;

const controllerPropTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

ContentControllers.propTypes = {
  left: PropTypes.shape(controllerPropTypes),
  right: PropTypes.shape(controllerPropTypes),
};

export default ContentControllers;
