module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575903, function(require, module, exports) {
'use strict'

const defaultMaxRunning = 50

const limit = module.exports = function (func, maxRunning) {
  const state = {running: 0, queue: []}
  if (!maxRunning) maxRunning = defaultMaxRunning
  return function limited () {
    const args = Array.prototype.slice.call(arguments)
    if (state.running >= maxRunning) {
      state.queue.push({obj: this, args})
    } else {
      callFunc(this, args)
    }
  }
  function callNext () {
    if (state.queue.length === 0) return
    const next = state.queue.shift()
    callFunc(next.obj, next.args)
  }
  function callFunc (obj, args) {
    const cb = typeof args[args.length - 1] === 'function' && args.pop()
    try {
      ++state.running
      func.apply(obj, args.concat(function () {
        --state.running
        process.nextTick(callNext)
        if (cb) process.nextTick(() => cb.apply(obj, arguments))
      }))
    } catch (err) {
      --state.running
      if (cb) process.nextTick(() => cb.call(obj, err))
      process.nextTick(callNext)
    }
  }
}

module.exports.method = function (classOrObj, method, maxRunning) {
  if (typeof classOrObj === 'function') {
    const func = classOrObj.prototype[method]
    classOrObj.prototype[method] = limit(func, maxRunning)
  } else {
    const func = classOrObj[method]
    classOrObj[method] = limit(func, maxRunning)
  }
}

module.exports.promise = function (func, maxRunning) {
  const state = {running: 0, queue: []}
  if (!maxRunning) maxRunning = defaultMaxRunning
  return function limited () {
    const args = Array.prototype.slice.call(arguments)
    if (state.running >= maxRunning) {
      return new Promise(resolve => {
        state.queue.push({resolve, obj: this, args})
      })
    } else {
      return callFunc(this, args)
    }
  }
  function callNext () {
    if (state.queue.length === 0) return
    const next = state.queue.shift()
    next.resolve(callFunc(next.obj, next.args))
  }
  function callFunc (obj, args) {
    return callFinally(() => {
      ++state.running
      return func.apply(obj, args)
    }, () => {
      --state.running
      process.nextTick(callNext)
    })
  }
  function callFinally (action, fin) {
    try {
      return Promise.resolve(action()).then(value => {
        fin()
        return value
      }, err => {
        fin()
        return Promise.reject(err)
      })
    } catch (err) {
      fin()
      return Promise.reject(err)
    }
  }
}

module.exports.promise.method = function (classOrObj, method, maxRunning) {
  if (typeof classOrObj === 'function') {
    const func = classOrObj.prototype[method]
    classOrObj.prototype[method] = limit.promise(func, maxRunning)
  } else {
    const func = classOrObj[method]
    classOrObj[method] = limit.promise(func, maxRunning)
  }
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575903);
})()
//# sourceMappingURL=index.js.map