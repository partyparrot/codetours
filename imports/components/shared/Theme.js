import React from 'react';
import { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
  dark: '#333',
  grey: '#777',
  light: '#fcfcfc',
  darkerBlue: '#2a6496',
  blue: '#428bca',
  flashBlue: '#0070D0',
};

injectGlobal`
  html {
    font-size: 62.5%; /* 1 rem is now 10px \o/ */
  }
  
  body {
    font-size: 1.4rem; 
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  
  a {
    color: ${theme.blue} !important; /* overwrite reboot a:not([href]) */
    text-decoration: none;
    cursor: pointer;
    
    &:hover, &:active {
      color: ${theme.darkerBlue} !important; /* overwrite reboot a:not([href]) */
      text-decoration: none;
    }
  }
`;

const Theme = props => (
  <ThemeProvider theme={theme}>
    {props.children}
  </ThemeProvider>
);

export default Theme;
