import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { lighten, radialGradient } from 'polished';
import { small, mediumLarge } from '../lib/styleHelpers';

const Header = ({ withGradient, handleSearchChange, search }) => (
  <Hero withGradient={withGradient}>
    <BrandName>CodeTours</BrandName>
    <Tagline>Take a tour of new and exciting open source codebases.</Tagline>
    <SearchInput
      type="text"
      placeholder="Search for a repository"
      onChange={handleSearchChange}
      value={search}
    />
  </Hero>
);

Header.propTypes = {
  withGradient: PropTypes.bool,
  handleSearchChange: PropTypes.func,
  search: PropTypes.string,
};

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${props => props.theme.light};
  ${small`
    padding: 3rem 0 3rem 0;
  `}
  ${mediumLarge`
    padding: 5rem 0 5rem 0;
  `}
  margin-bottom: 3rem;
  background-size: 100%;
  ${props => props.withGradient ? radialGradient({
        colorStops: [
          `${lighten(0.2, props.theme.blue)} 0%`,
          `${lighten(0.1, props.theme.blue)} 30%`,
          `${props.theme.blue} 60%`,
          `${props.theme.darkerBlue} 90%`,
        ],
        shape: 'circle',
      }) : 'background-image: url("/background.jpeg")'};
`;

const BrandName = styled.div`
  font-family: 'Pacifico', cursive;
  font-size: 6.7rem;
  text-shadow: ${props => props.theme.dark} 0 0 .5rem;
  margin-bottom: 3rem;
`;

const Tagline = styled.div`
  font-weight: 200;
  font-size: 2.1rem;
  text-shadow: ${props => props.theme.dark} 0 0 5px;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 50%;
  max-width: 60rem;
  border-radius: .6rem;
  border: ${props => props.theme.light} solid .1rem;
  box-shadow: inset 0 .1rem .1rem rgba(0, 0, 0, 0.075);
  line-height: 1.3;
  padding: .9rem 1.6rem;
  font-size: 1.6rem;
  
  &:focus {
    border-color: ${props => props.theme.blue};
    outline: 0;
  }
`;

export default Header;
