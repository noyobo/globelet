# 💧  Globelet

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