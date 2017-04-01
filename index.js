const fs = require('fs');
const globby = require('globby');

module.exports = function (patterns, opts) {
	return globby(patterns, opts);
};

module.exports.sync = function (patterns, opts) {
	return globby.sync(patterns, opts);
};

module.exports.generateGlobTasks = globby.generateGlobTasks;

module.exports.hasMagic = function (patterns, opts) {
	return globby.hasMagic;
};
