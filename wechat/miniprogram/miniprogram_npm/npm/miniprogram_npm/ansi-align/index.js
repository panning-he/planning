module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575830, function(require, module, exports) {
'use strict'

const stringWidth = require('string-width')

function ansiAlign (text, opts) {
  if (!text) return text

  opts = opts || {}
  const align = opts.align || 'center'

  // short-circuit `align: 'left'` as no-op
  if (align === 'left') return text

  const split = opts.split || '\n'
  const pad = opts.pad || ' '
  const widthDiffFn = align !== 'right' ? halfDiff : fullDiff

  let returnString = false
  if (!Array.isArray(text)) {
    returnString = true
    text = String(text).split(split)
  }

  let width
  let maxWidth = 0
  text = text.map(function (str) {
    str = String(str)
    width = stringWidth(str)
    maxWidth = Math.max(width, maxWidth)
    return {
      str,
      width
    }
  }).map(function (obj) {
    return new Array(widthDiffFn(maxWidth, obj.width) + 1).join(pad) + obj.str
  })

  return returnString ? text.join(split) : text
}

ansiAlign.left = function left (text) {
  return ansiAlign(text, { align: 'left' })
}

ansiAlign.center = function center (text) {
  return ansiAlign(text, { align: 'center' })
}

ansiAlign.right = function right (text) {
  return ansiAlign(text, { align: 'right' })
}

module.exports = ansiAlign

function halfDiff (maxWidth, curWidth) {
  return Math.floor((maxWidth - curWidth) / 2)
}

function fullDiff (maxWidth, curWidth) {
  return maxWidth - curWidth
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575830);
})()
//# sourceMappingURL=index.js.map