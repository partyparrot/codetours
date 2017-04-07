import React from 'react';
import styled from 'styled-components';
import { compose, withHandlers, withState, pure } from 'recompose';
import marked from 'marked';

import Headtags from './Headtags';
import Header from './Header';
import RecentTours from './RecentTours';
import Sidebar from './Sidebar';

const Frontpage = ({ handleSearchChange, search }) => (
  <div>
    <Headtags />
    <Header handleSearchChange={handleSearchChange} search={search} />
    <PageContent>
      <RecentTours search={search} />
      <Sidebar />
    </PageContent>
    <p
      dangerouslySetInnerHTML={{
        __html: marked(
          `
Made with ![Fiesta Parrot](/fiestaparrot.gif)
by [Angela Zhang](https://github.com/zhangela) and
[Sashko Stubailo](https://github.com/stubailo).
[Contribute on GitHub.](https://github.com/partyparrot/codetours)
          `
        ),
      }}
    />
  </div>
);

export const PageContent = styled.div`
  margin-bottom: 2rem;  
`;

export default compose(
  withState('search', 'updateSearch', ''),
  withHandlers({
    handleSearchChange: ({ updateSearch }) => event => updateSearch(event.target.value),
  }),
  pure
)(Frontpage);
