"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets the value at path of object
 * @param {any} o  object
 * @param {string} path path
 * @param {any} v default value
 */
function get(o, path, v) {
    if (v === void 0) { v = undefined; }
    if (typeof o === 'undefined')
        return v;
    var props = stringToPath(path);
    if (props.length === 0)
        return o[path];
    for (var t = o, i = 0; i < props.length; ++i) {
        t = t[props[i]];
        if (typeof t === 'undefined')
            return v;
    }
    return t;
}
exports.get = get;
/**
 * Sets the value at path of object
 * @param {any} o object
 * @param {string} path path
 * @param {any} v value
 */
function set(o, path, v) {
    var props = stringToPath(path);
    if (typeof o === 'undefined')
        return v;
    if (!props || !props.length)
        return v;
    if (props.length === 1) {
        return o[path] = v;
    }
    else {
        var lastPart = props.pop();
        if (!lastPart)
            return v;
        for (var t = o, i = 0; i < props.length; ++i) {
            t = t[props[i]];
            if (typeof t === 'undefined')
                return v;
        }
        return t[lastPart] = v;
    }
}
exports.set = set;
/* following code extract from https://github.com/lodash/lodash/blob/master/.internal/stringToPath.js */
/** Used to match property names within property paths. */
var rePropName = RegExp(
// Match anything that isn't a dot or bracket.
'[^.[\\]]+' + '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' + '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g');
/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;
var charCodeOfDot = '.'.charCodeAt(0);
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
function stringToPath(str) {
    var result = [];
    if (str.charCodeAt(0) === charCodeOfDot) {
        result.push('');
    }
    // @ts-ignore
    str.replace(rePropName, function (match, expression, quote, subString) {
        var key = match;
        if (quote) {
            key = subString.replace(reEscapeChar, '$1');
        }
        else if (expression) {
            key = expression.trim();
        }
        result.push(key);
    });
    return result;
}
;
/**
 * De-reference given object
 * @param {object}  obj
 * @param {number} indent
 * @return  {object}
 */
function deref(obj, indent) {
    if (indent === void 0) { indent = 2; }
    var res = obj;
    var str = JSON.stringify(obj, function (k, v) {
        return typeof v === 'string' ? v.replace(/\{(.*?)\}/, function (_, match) {
            return get(obj, match.substr(deref.REF_ROOT_PREFIX.length));
        }) : v;
    }, indent);
    res = JSON.parse(str);
    return res;
}
exports.deref = deref;
;
deref.REF_ROOT_PREFIX = '$.';
