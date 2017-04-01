const path = require('path');
const globby = require('globby');
const flatten = require('array-flatten');

/* eslint no-param-reassign: 0 */
function globelet(fn, patterns, opts) {
  opts = opts || {};
  const extnames = opts.globelet || ['.jsx', '.js'];
  delete opts.globelet;

  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }

  const globeletPatterns = patterns
    .filter(pattern => typeof pattern === 'string')
    .map((pattern) => {
      if (!globby.hasMagic(pattern)) {
        if (path.extname(pattern) === '' && pattern.endsWith('/')) {
          return extnames.map(ext => `${pattern}**/*${ext}`);
        } else if (path.extname(pattern) === '') {
          return extnames.map(ext => `${pattern}/**/*${ext}`);
        }
      }
      return pattern;
    });
  return fn.apply(fn, [flatten(globeletPatterns), opts]);
}

module.exports = (patterns, opts) => globelet(globby, patterns, opts);
module.exports.sync = (patterns, opts) => globelet(globby.sync, patterns, opts);
module.exports.generateGlobTasks = globby.generateGlobTasks;
module.exports.hasMagic = globby.hasMagic;
