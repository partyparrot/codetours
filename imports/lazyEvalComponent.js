import React from 'react';

export default function lazyEvalComponent(requireFunc) {
  return function LazyEvalWrapper(...props) {
    return React.createElement(requireFunc().default, ...props);
  };
}
