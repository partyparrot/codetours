import React from 'react';
import styled from 'styled-components';
import marked from 'marked';

const Footer = () => (
  <Paragraph
    dangerouslySetInnerHTML={{
      __html: marked(
        `
Made with ![Fiesta Parrot](/fiestaparrot.gif)
by [Xavier Cazalot](https://github.com/xavcz), [Angela Zhang](https://github.com/zhangela) and
[Sashko Stubailo](https://github.com/stubailo).
[Contribute on GitHub.](https://github.com/partyparrot/codetours)
        `
      ),
    }}
  />
);

const Paragraph = styled.div`
  display: flex;
  justify-content: center;
`;

export default Footer;
