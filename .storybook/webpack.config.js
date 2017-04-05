const genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

module.exports = function(baseConfig, env) {
  const config = genDefaultConfig(baseConfig, env);

  config.module.loaders.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  });

  return config;
};
