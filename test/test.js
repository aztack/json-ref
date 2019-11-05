const jsonref = require('../dist/index.js');
const get = jsonref.get;
const set = jsonref.set;
const deref = jsonref.deref;

const b = {c: 42};
const config = {
  a: {
    b: {
      c: 42
    }
  },
  ary: [{a:1}, {b: {c: 42}}]
}

// get
test('get path from null with default value', () => {
  expect(get(null, 'a.b.c', 43)).toEqual(43);
});

test('get empty path from object with default value', () => {
  expect(get(config, '', 43)).toBe(43);
});

test('get single part path from object', () => {
  expect(get(config, 'a')).toEqual({b: {c: 42}});
});

test('get valid path from object', () => {
  expect(get(config, 'a.b.c')).toBe(42);
});

test('get non-exists path from object', () => {
  expect(get(config, 'a.x.y')).toBe(undefined);
});

test('get ".[index]" path from array', () => {
  expect(get(config, 'ary.[0]')).toEqual({a:1});
});

test('get ".index" path from array', () => {
  expect(get(config, 'ary.1.b.c')).toBe(42);
});

// set
// TODO

// deref
test('simple deref', () => {
  const cfg = {
    "base": "https://domain.com/dir",
    "config": "{$.base}/project.json",
    "images": {
      "img1": "{$.base}/img1.png",
      "img2": "{$.base}/img2.png"
    },
    "props": {
      "button/background": {
        "url": "{$.images.img1}"
      }
    }
  };
  const derefed = deref(cfg);
  expect(derefed).toEqual({
    "base": "https://domain.com/dir",
    "config": "https://domain.com/dir/project.json",
    "images": {
      "img1": "https://domain.com/dir/img1.png",
      "img2": "https://domain.com/dir/img2.png"
    },
    "props": {
      "button/background": {
        "url": "https://domain.com/dir/img1.png"
      }
    }
  });
});