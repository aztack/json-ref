# json-ref
JSON with Reference

## Example

```js
const deref = require('json-ref').deref;
const config = {
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
console.log(deref(config));
```

will output

```json
{
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
}
```