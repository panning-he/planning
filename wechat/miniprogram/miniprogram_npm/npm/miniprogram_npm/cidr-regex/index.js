module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575912, function(require, module, exports) {
"use strict";

const ipRegex = require("ip-regex");

const v4 = ipRegex.v4().source + "\\/(3[0-2]|[12]?[0-9])";
const v6 = ipRegex.v6().source + "\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])";

const cidr = module.exports = opts => opts && opts.exact ?
  new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
  new RegExp(`(?:${v4})|(?:${v6})`, "g");

cidr.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, "g");
cidr.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, "g");

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575912);
})()
//# sourceMappingURL=index.js.map