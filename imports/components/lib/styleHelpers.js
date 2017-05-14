import { css } from 'styled-components';

// medias queries
// note: we could make the breakpoints depends on the theme object?
export const small = (...args) => css`
  @media screen and (max-width: 60rem) {
    ${css(...args)}
  }
`;

export const medium = (...args) => css`
  @media screen and (min-width: 60.1rem) and (max-width: 120rem) {
    ${css(...args)}
  }
`;

export const mediumLarge = (...args) => css`
  @media screen and (min-width: 60.1rem) {
    ${css(...args)}
  }
`;

export const large = (...args) => css`
  @media screen and (min-width: 120.1rem) {
    ${css(...args)}
  }
`;
