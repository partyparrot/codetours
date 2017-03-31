import React from 'react';
import { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
  muted: '#777',
  blue: '#428bca',
  darkerBlue: '#2a6496',
};

injectGlobal`
  
  *, *:before, *:after {
    box-sizing: border-box;
  }
  
  body, p {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
  }
  
  a {
    color: ${theme.blue};
    text-decoration: none;
    
    &:hover, &:active {
      color: ${theme.darkerBlue};
    }
  }
`;

const Theme = props => (
  <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
);

export default Theme;
