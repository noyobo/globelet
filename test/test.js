const fs = require('fs');
const path = require('path');
const test = require('ava');
const outputFileSync = require('output-file-sync');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const m = require('../');

mkdirp.sync(path.join(__dirname, 'fixtures'));
process.chdir(path.join(__dirname, 'fixtures'));

const cwd = process.cwd();
const fixture = [
  'a.tmp',
  'b.tmp',
  'c.tmp',
  'd.tmp',
  'e.tmp',
  'a.js',
  'b.js',
  'c.js',
  'd.jsx',
  'e.jsx',
  'dir/a.js',
  'dir/b.jsx',
  'dir/c.tmp',
];

test.before(() => {
  fs.mkdirSync('tmp');
  fixture.forEach((file) => {
    outputFileSync(file, 'hello');
  });
});

test.after(() => {
  rimraf.sync(path.join(__dirname, 'fixtures'));
});

test('globelet - async', async (t) => {
  t.deepEqual(await m('.'), [
    './d.jsx',
    './dir/b.jsx',
    './e.jsx',
    './a.js',
    './b.js',
    './c.js',
    './dir/a.js',
  ]);
});

test('globelet - async root directory', async (t) => {
  t.deepEqual(await m('./'), [
    './d.jsx',
    './dir/b.jsx',
    './e.jsx',
    './a.js',
    './b.js',
    './c.js',
    './dir/a.js',
  ]);
});

test('globelet - async specified directory', async (t) => {
  t.deepEqual(await m('./dir'), [
    './dir/b.jsx',
    './dir/a.js',
  ]);
});

test('globelet - async specified directory', async (t) => {
  t.deepEqual(await m('./dir/'), [
    './dir/b.jsx',
    './dir/a.js',
  ]);
});


test('glob - async', async (t) => {
  t.deepEqual(await m('*.tmp'), ['a.tmp', 'b.tmp', 'c.tmp', 'd.tmp', 'e.tmp']);
});

test('glob - async *.*', async (t) => {
  t.deepEqual(await m('*.*'), [
    'a.js',
    'a.tmp',
    'b.js',
    'b.tmp',
    'c.js',
    'c.tmp',
    'd.jsx',
    'd.tmp',
    'e.jsx',
    'e.tmp',
  ]);
});

test('glob - async *', async (t) => {
  t.deepEqual(await m('*'), [
    'a.js',
    'a.tmp',
    'b.js',
    'b.tmp',
    'c.js',
    'c.tmp',
    'd.jsx',
    'd.tmp',
    'dir',
    'e.jsx',
    'e.tmp',
    'tmp',
  ]);
});

test('glob - async', async (t) => {
  t.deepEqual(await m('*.*'), [
    'a.js',
    'a.tmp',
    'b.js',
    'b.tmp',
    'c.js',
    'c.tmp',
    'd.jsx',
    'd.tmp',
    'e.jsx',
    'e.tmp',
  ]);
});

test('glob with multiple patterns - async', async (t) => {
  t.deepEqual(await m(['a.tmp', '*.tmp', '!{c,d,e}.tmp']), ['a.tmp', 'b.tmp']);
});

test('respect patterns order - async', async (t) => {
  t.deepEqual(await m(['!*.tmp', 'a.tmp']), ['a.tmp']);
});

test('glob - sync', (t) => {
  t.deepEqual(m.sync('*.tmp'), ['a.tmp', 'b.tmp', 'c.tmp', 'd.tmp', 'e.tmp']);
  t.deepEqual(m.sync(['a.tmp', '*.tmp', '!{c,d,e}.tmp']), ['a.tmp', 'b.tmp']);
  t.deepEqual(m.sync(['!*.tmp', 'a.tmp']), ['a.tmp']);
});

test('return [] for all negative patterns - sync', (t) => {
  t.deepEqual(m.sync(['!a.tmp', '!b.tmp']), []);
});

test('return [] for all negative patterns - async', async (t) => {
  t.deepEqual(await m(['!a.tmp', '!b.tmp']), []);
});

test('cwd option', (t) => {
  process.chdir('tmp');
  t.deepEqual(m.sync('*.tmp', { cwd }), [
    'a.tmp',
    'b.tmp',
    'c.tmp',
    'd.tmp',
    'e.tmp',
  ]);
  t.deepEqual(m.sync(['a.tmp', '*.tmp', '!{c,d,e}.tmp'], { cwd }), [
    'a.tmp',
    'b.tmp',
  ]);
  process.chdir(cwd);
});

test('don\'t mutate the options object - async', async () => {
  await m(['*.tmp', '!b.tmp'], Object.freeze({ ignore: Object.freeze([]) }));
});

test('don\'t mutate the options object - sync', () => {
  m.sync(['*.tmp', '!b.tmp'], Object.freeze({ ignore: Object.freeze([]) }));
});

test('expose generateGlobTasks', (t) => {
  const tasks = m.generateGlobTasks(['*.tmp', '!b.tmp'], { ignore: ['c.tmp'] });

  t.is(tasks.length, 1);
  t.is(tasks[0].pattern, '*.tmp');
  t.deepEqual(tasks[0].opts.ignore, ['c.tmp', 'b.tmp']);
});

test('expose hasMagic', (t) => {
  t.true(m.hasMagic('**'));
  t.true(m.hasMagic(['**', 'path1', 'path2']));
  t.false(m.hasMagic(['path1', 'path2']));
});
