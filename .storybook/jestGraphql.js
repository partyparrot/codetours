// note:
// `jest-transform-graphql` is obsolete at the moment
// once we figure out how to use graphql-tag/loader correctly with jest
// we'll open a PR on the transform package :)

const gql = require('graphql-tag');

// eslint-disable-next-line
function expandImports(source, doc) {
  const lines = source.split('\n');
  let outputCode = '';

  lines.some(line => {
    if (line[0] === '#' && line.slice(1).split(' ')[0] === 'import') {
      const importFile = line.slice(1).split(' ')[1];
      const parseDocument = `require(${importFile})`;
      const appendDef = `doc.definitions = doc.definitions.concat(${parseDocument}.definitions);`;
      outputCode += appendDef + '\n';
    }
    return line.length !== 0 && line[0] !== '#';
  });

  return outputCode;
}

module.exports = {
  process(source) {
    // line removed here: cacheable from webpack
    // https://webpack.github.io/docs/loaders.html#cacheable
    const doc = gql`${source}`;
    const outputCode = `var doc = ${JSON.stringify(doc)};`;
    const importOutputCode = expandImports(source, doc);

    // uncomment for debug
    // console.log(outputCode + '\n' + importOutputCode + '\n' + `module.exports = doc;`);

    return outputCode + '\n' + importOutputCode + '\n' + `module.exports = doc;`;
  },
};
