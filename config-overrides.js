const fs = require('fs');
const crypto = require('crypto');

module.exports = function override(config, env) {
  // New config, e.g. config.plugins.push...
  console.log('Config Overridden Successfully!');

  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        lib: {
          test(module) {
            return (
              module.size() > 150000 && // 150KB cut off for any npm library (change this value to meet your requirements)
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name(module) {
            const hash = crypto.createHash(`sha1`);
            hash.update(module.libIdent({ context: 'dir' }));

            return 'lib-' + hash.digest(`hex`).substring(0, 8);
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        commons: {
          name: 'commons',
          minChunks: 3, // define (or pass in) the total number of pages here
          priority: 20,
        },
        shared: {
          name(module, chunks) {
            const hash = crypto
              .createHash(`sha1`)
              .update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
              .digest(`hex`);

            return hash;
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  };

  return config;
};
