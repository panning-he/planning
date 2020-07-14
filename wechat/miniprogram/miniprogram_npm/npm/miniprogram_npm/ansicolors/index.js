module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575833, function(require, module, exports) {
// ColorCodes explained: http://www.termsys.demon.co.uk/vtansi.htm
'use strict';

var colorNums = {
      white         :  37
    , black         :  30
    , blue          :  34
    , cyan          :  36
    , green         :  32
    , magenta       :  35
    , red           :  31
    , yellow        :  33
    , brightBlack   :  90
    , brightRed     :  91
    , brightGreen   :  92
    , brightYellow  :  93
    , brightBlue    :  94
    , brightMagenta :  95
    , brightCyan    :  96
    , brightWhite   :  97
    }
  , backgroundColorNums = {
      bgBlack         :  40
    , bgRed           :  41
    , bgGreen         :  42
    , bgYellow        :  43
    , bgBlue          :  44
    , bgMagenta       :  45
    , bgCyan          :  46
    , bgWhite         :  47
    , bgBrightBlack   :  100
    , bgBrightRed     :  101
    , bgBrightGreen   :  102
    , bgBrightYellow  :  103
    , bgBrightBlue    :  104
    , bgBrightMagenta :  105
    , bgBrightCyan    :  106
    , bgBrightWhite   :  107
    } 
  , open   =  {}
  , close  =  {}
  , colors =  {}
  ;

Object.keys(colorNums).forEach(function (k) {
  var o =  open[k]  =  '\u001b[' + colorNums[k] + 'm';
  var c =  close[k] =  '\u001b[39m';

  colors[k] = function (s) { 
    return o + s + c;
  };
});

Object.keys(backgroundColorNums).forEach(function (k) {
  var o =  open[k]  =  '\u001b[' + backgroundColorNums[k] + 'm';
  var c =  close[k] =  '\u001b[49m';

  colors[k] = function (s) { 
    return o + s + c;
  };
});

module.exports =  colors;
colors.open    =  open;
colors.close   =  close;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575833);
})()
//# sourceMappingURL=index.js.map