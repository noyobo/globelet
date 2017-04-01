# 💧  Globelet

[![](https://travis-ci.org/noyobo/globelet.svg?branch=master)](https://travis-ci.org/noyobo/globelet) [![Codecov](https://img.shields.io/codecov/c/github/noyobo/globelet/master.svg)](https://codecov.io/gh/noyobo/globelet/branch/master) [![npm package](https://img.shields.io/npm/v/globelet.svg)](https://www.npmjs.org/package/globelet) [![NPM downloads](http://img.shields.io/npm/dm/globelet.svg)](https://npmjs.org/package/globelet)

Extends [globby](https://github.com/sindresorhus/globby) with support for directory

## Installation

```bash
npm install globelet
```

## Usage

```
└── dir
  ├── one.js
  ├── two.jsx
  └── three.tmp
```

```js
const globelet = require('globelet');

globelet(['./dir'], {
  globelet: ['.js', '.jsx'] // default: matches js jsx files
})
.then(paths => {
  console.log(paths);
  //=> ['./dir/one.js', './dir/two.jsx']
});
```

## [API](https://github.com/sindresorhus/globby#api)