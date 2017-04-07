import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import Placeloader from './lib/Placeloader';
import { getTourLink, getTourUsernames } from '../helpers';

const TourBadge = props => {
  const { tour, big } = props;
  const { authorUsername, targetUsername } = getTourUsernames(tour);
  const tourLink = getTourLink(tour);

  return (
    <TourWrapper>
      <TourImage src={`https://github.com/${targetUsername}.png`} big={big} />
      <TourContent>
        <TourTitle
          tourLink={tourLink}
          tourTitle={tour.targetRepository}
          tourAuthor={authorUsername}
          big={big}
        />
        <TourParagraph big={big}>{tour.description}</TourParagraph>
        {!big &&
          <TourParagraph>
            <SecondaryText>Contribute at </SecondaryText>
            <a href={`https://github.com/${tour.repository}`}>
              {tour.repository}
            </a>
          </TourParagraph>}
      </TourContent>
    </TourWrapper>
  );
};

const TourWrapper = styled.div`
  margin-bottom: 4rem;
  display: flex;
  align-items: center;
`;

const TourImage = styled.img`
  ${props => props.big ? 'max-height: 13.2rem' : 'height: 7rem'};
  ${props => props.big ? 'max-width: 13.2rem' : 'width: 7rem'};
  margin-right: ${props => props.big ? 6 : 2}rem;
`;

const TourContent = styled.div`
  /* 
    give a consistent alignment between the tour image and the content,
    as the TourWrapper is a flex container centering on the cross axis
  */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  *:last-child {
    margin: 0; 
  }
`;

const TourTitle = ({ tourLink, tourAuthor, tourTitle, big }) => {
  const Title = styled[big ? 'h1' : 'h4']``;

  return big
    ? <Title>
        <SecondaryText>Tour of </SecondaryText>
        {tourTitle}
        <SecondaryText>
          , led by <a href={`https://github.com/${tourAuthor}`}>{tourAuthor}</a>
        </SecondaryText>
      </Title>
    : <Title>
        <Link to={tourLink}>
          {tourTitle}
          <SecondaryText> by {tourAuthor}</SecondaryText>
        </Link>
      </Title>;
};

const SecondaryText = styled.span`
  color: ${props => props.theme.grey};
  font-weight: normal;
`;

const TourParagraph = styled.p`
  ${props => props.big && 'font-size: 2rem'};
`;

export default TourBadge;

// This experiment could be abstracted in some kind of higher order component
// that parses the component and copy the structure ?
export const TourBadgePlaceloader = ({ big }) => (
  <TourWrapper>
    <Placeloader
      width={big ? '13.2rem' : '7rem'}
      height={big ? '13.2rem' : '7rem'}
      marginRight={big ? '6rem' : '2rem'}
    />
    <TourContent>
      <Placeloader width="30rem" height={big ? '2.2rem' : '1rem'} marginBottom="1rem" />
      <Placeloader width="20rem" height="1rem" marginBottom="1rem" />
      {!big && <Placeloader width="30rem" height="1rem" />}
    </TourContent>
  </TourWrapper>
);
