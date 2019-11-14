/**
 * Gets the value at path of object
 * @param {any} o  object
 * @param {string} path path
 * @param {any} v default value
 */
export function get(o: any, path: string, v?: any): any {
  path = String(path);
  if (!o || !path) return v;
  const props = stringToPath(path);
  if (props.length === 0) return o[path];
  let t = o;
  let i = 0;
  for (;i < props.length; ++i){
    t = t[props[i]]
    if(typeof t ==='undefined') return v;
  }
  return t;
}

/**
 * Sets the value at path of object
 * @param {any} o object
 * @param {string} path path
 * @param {any} v value
 */
export function set(o: any, path: string, v: any): any {
  const props = stringToPath(path);
  if (typeof o === 'undefined') return v;
  if (!props || !props.length) return v;
  if (props.length === 1) {
    return o[path] = v;
  } else {
    const lastPart = props.pop();
    if (!lastPart) return v;
    let t = o;
    let i = 0;
    for (;i < props.length; ++i){
      t = t[props[i]]
      if(typeof t ==='undefined') return v;
    }
    return t[lastPart] = v;
  }
}

/* Following code is extracted from https://github.com/lodash/lodash/blob/master/.internal/stringToPath.js */

/** Used to match property names within property paths. */
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g')
/** Used to match backslashes in property paths. */
const reEscapeChar = /\\(\\)?/g

const charCodeOfDot = '.'.charCodeAt(0)
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
function stringToPath(str: string): any[] {
  const result = [];
  if (str.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  // @ts-ignore
  str.replace(rePropName, (match: string, expression: any, quote: any, subString: string) => {
    let key = match
    if (quote) {
      key = subString.replace(reEscapeChar, '$1')
    }
    else if (expression) {
      key = expression.trim()
    }
    result.push(key)
  })
  return result;
};

/**
 * De-reference given object
 * @param {object}  obj
 * @param {number} indent
 * @return  {object}
 */
export function deref (obj: object, indent: number = 2): object {
  let res = obj;
  const str = JSON.stringify(obj, (k: string, v: any) => {
    return typeof v === 'string' ? v.replace(deref.REF_CHECK, (_, match) => {
      return get(obj, match.substr(deref.REF_ROOT_PREFIX.length));
    }) : v;
  }, indent);
  if (str.match(deref.REF_CHECK)) {
    res = JSON.parse(str);
    return deref(res);
  }
  res = JSON.parse(str);
  return res;
};

deref.REF_CHECK = /\{(.*?)\}/;
deref.REF_ROOT_PREFIX = '$.';