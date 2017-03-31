import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

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
  margin-top: 40px;
  display: flex;
  align-items: center;
`;

const TourImage = styled.img`
  ${props => props.big ? 'max-width: 132px' : 'width: 70px'};
  ${props => props.big ? 'max-height: 132px' : 'height: 70px'};
  margin-right: ${props => props.big ? 60 : 20}px;
`;

const TourContent = styled.div``;

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
  color: ${props => props.theme.muted};
  font-weight: normal;
`;

const TourParagraph = styled.p`
  font-size: ${props => props.big ? '20px' : '1em'};
  margin: 10px 0 0 0;
`;

export default TourBadge;
