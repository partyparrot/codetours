import React from 'react';
import styled from 'styled-components';
import { compose, withHandlers, withState, pure } from 'recompose';

import Headtags from '../shared/Headtags';
import Header from './Header';
import ContentControllers from './ContentControllers';
import RecentTours from './RecentTours';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Frontpage = ({ handleSearchChange, search, toggleContentSelected, selectedContent }) => (
  <div>
    <Headtags />
    <Header handleSearchChange={handleSearchChange} search={search} withGradient />
    <ContentControllers
      left={{
        title: search ? 'Search results' : 'Recently added tours',
        selected: selectedContent === 'left',
      }}
      right={{
        title: "What's a tour?",
        selected: selectedContent === 'right',
      }}
      toggleController={toggleContentSelected}
    />
    <PageContent>
      {selectedContent === 'left' ? <RecentTours search={search} /> : <Sidebar />}
    </PageContent>
    <Footer />
  </div>
);

export const PageContent = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  > * {
    max-width: 96rem;
  }
`;

export default compose(
  withState('selectedContent', 'updateSelectedContent', 'left'),
  withState('search', 'updateSearch', ''),
  withHandlers({
    handleSearchChange: ({ updateSearch }) => event => updateSearch(event.target.value),
    toggleContentSelected: ({ updateSelectedContent }) =>
      value => () => updateSelectedContent(value),
  }),
  pure
)(Frontpage);
