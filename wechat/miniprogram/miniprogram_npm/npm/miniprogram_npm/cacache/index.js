module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575883, function(require, module, exports) {
'use strict'

module.exports = require('./locales/en.js')

}, function(modId) {var map = {"./locales/en.js":1594707575884}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575884, function(require, module, exports) {
'use strict'

const ls = require('../ls.js')
const get = require('../get.js')
const put = require('../put.js')
const rm = require('../rm.js')
const verify = require('../verify.js')
const setLocale = require('../lib/util/y.js').setLocale
const clearMemoized = require('../lib/memoization.js').clearMemoized
const tmp = require('../lib/util/tmp.js')

setLocale('en')

const x = module.exports

x.ls = cache => ls(cache)
x.ls.stream = cache => ls.stream(cache)

x.get = (cache, key, opts) => get(cache, key, opts)
x.get.byDigest = (cache, hash, opts) => get.byDigest(cache, hash, opts)
x.get.sync = (cache, key, opts) => get.sync(cache, key, opts)
x.get.sync.byDigest = (cache, key, opts) => get.sync.byDigest(cache, key, opts)
x.get.stream = (cache, key, opts) => get.stream(cache, key, opts)
x.get.stream.byDigest = (cache, hash, opts) => get.stream.byDigest(cache, hash, opts)
x.get.copy = (cache, key, dest, opts) => get.copy(cache, key, dest, opts)
x.get.copy.byDigest = (cache, hash, dest, opts) => get.copy.byDigest(cache, hash, dest, opts)
x.get.info = (cache, key) => get.info(cache, key)
x.get.hasContent = (cache, hash) => get.hasContent(cache, hash)
x.get.hasContent.sync = (cache, hash) => get.hasContent.sync(cache, hash)

x.put = (cache, key, data, opts) => put(cache, key, data, opts)
x.put.stream = (cache, key, opts) => put.stream(cache, key, opts)

x.rm = (cache, key) => rm.entry(cache, key)
x.rm.all = cache => rm.all(cache)
x.rm.entry = x.rm
x.rm.content = (cache, hash) => rm.content(cache, hash)

x.setLocale = lang => setLocale(lang)
x.clearMemoized = () => clearMemoized()

x.tmp = {}
x.tmp.mkdir = (cache, opts) => tmp.mkdir(cache, opts)
x.tmp.withTmp = (cache, opts, cb) => tmp.withTmp(cache, opts, cb)

x.verify = (cache, opts) => verify(cache, opts)
x.verify.lastRun = cache => verify.lastRun(cache)

}, function(modId) { var map = {"../ls.js":1594707575885,"../get.js":1594707575892,"../put.js":1594707575895,"../rm.js":1594707575898,"../verify.js":1594707575900,"../lib/util/y.js":1594707575891,"../lib/memoization.js":1594707575893,"../lib/util/tmp.js":1594707575902}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575885, function(require, module, exports) {
'use strict'

var index = require('./lib/entry-index')

module.exports = index.ls
module.exports.stream = index.lsStream

}, function(modId) { var map = {"./lib/entry-index":1594707575886}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575886, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const contentPath = require('./content/path')
const crypto = require('crypto')
const figgyPudding = require('figgy-pudding')
const fixOwner = require('./util/fix-owner')
const fs = require('graceful-fs')
const hashToSegments = require('./util/hash-to-segments')
const ms = require('mississippi')
const path = require('path')
const ssri = require('ssri')
const Y = require('./util/y.js')

const indexV = require('../package.json')['cache-version'].index

const appendFileAsync = BB.promisify(fs.appendFile)
const readFileAsync = BB.promisify(fs.readFile)
const readdirAsync = BB.promisify(fs.readdir)
const concat = ms.concat
const from = ms.from

module.exports.NotFoundError = class NotFoundError extends Error {
  constructor (cache, key) {
    super(Y`No cache entry for \`${key}\` found in \`${cache}\``)
    this.code = 'ENOENT'
    this.cache = cache
    this.key = key
  }
}

const IndexOpts = figgyPudding({
  metadata: {},
  size: {}
})

module.exports.insert = insert
function insert (cache, key, integrity, opts) {
  opts = IndexOpts(opts)
  const bucket = bucketPath(cache, key)
  const entry = {
    key,
    integrity: integrity && ssri.stringify(integrity),
    time: Date.now(),
    size: opts.size,
    metadata: opts.metadata
  }
  return fixOwner.mkdirfix(
    cache, path.dirname(bucket)
  ).then(() => {
    const stringified = JSON.stringify(entry)
    // NOTE - Cleverness ahoy!
    //
    // This works because it's tremendously unlikely for an entry to corrupt
    // another while still preserving the string length of the JSON in
    // question. So, we just slap the length in there and verify it on read.
    //
    // Thanks to @isaacs for the whiteboarding session that ended up with this.
    return appendFileAsync(
      bucket, `\n${hashEntry(stringified)}\t${stringified}`
    )
  }).then(
    () => fixOwner.chownr(cache, bucket)
  ).catch({ code: 'ENOENT' }, () => {
    // There's a class of race conditions that happen when things get deleted
    // during fixOwner, or between the two mkdirfix/chownr calls.
    //
    // It's perfectly fine to just not bother in those cases and lie
    // that the index entry was written. Because it's a cache.
  }).then(() => {
    return formatEntry(cache, entry)
  })
}

module.exports.insert.sync = insertSync
function insertSync (cache, key, integrity, opts) {
  opts = IndexOpts(opts)
  const bucket = bucketPath(cache, key)
  const entry = {
    key,
    integrity: integrity && ssri.stringify(integrity),
    time: Date.now(),
    size: opts.size,
    metadata: opts.metadata
  }
  fixOwner.mkdirfix.sync(cache, path.dirname(bucket))
  const stringified = JSON.stringify(entry)
  fs.appendFileSync(
    bucket, `\n${hashEntry(stringified)}\t${stringified}`
  )
  try {
    fixOwner.chownr.sync(cache, bucket)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
  return formatEntry(cache, entry)
}

module.exports.find = find
function find (cache, key) {
  const bucket = bucketPath(cache, key)
  return bucketEntries(bucket).then(entries => {
    return entries.reduce((latest, next) => {
      if (next && next.key === key) {
        return formatEntry(cache, next)
      } else {
        return latest
      }
    }, null)
  }).catch(err => {
    if (err.code === 'ENOENT') {
      return null
    } else {
      throw err
    }
  })
}

module.exports.find.sync = findSync
function findSync (cache, key) {
  const bucket = bucketPath(cache, key)
  try {
    return bucketEntriesSync(bucket).reduce((latest, next) => {
      if (next && next.key === key) {
        return formatEntry(cache, next)
      } else {
        return latest
      }
    }, null)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null
    } else {
      throw err
    }
  }
}

module.exports.delete = del
function del (cache, key, opts) {
  return insert(cache, key, null, opts)
}

module.exports.delete.sync = delSync
function delSync (cache, key, opts) {
  return insertSync(cache, key, null, opts)
}

module.exports.lsStream = lsStream
function lsStream (cache) {
  const indexDir = bucketDir(cache)
  const stream = from.obj()

  // "/cachename/*"
  readdirOrEmpty(indexDir).map(bucket => {
    const bucketPath = path.join(indexDir, bucket)

    // "/cachename/<bucket 0xFF>/*"
    return readdirOrEmpty(bucketPath).map(subbucket => {
      const subbucketPath = path.join(bucketPath, subbucket)

      // "/cachename/<bucket 0xFF>/<bucket 0xFF>/*"
      return readdirOrEmpty(subbucketPath).map(entry => {
        const getKeyToEntry = bucketEntries(
          path.join(subbucketPath, entry)
        ).reduce((acc, entry) => {
          acc.set(entry.key, entry)
          return acc
        }, new Map())

        return getKeyToEntry.then(reduced => {
          for (let entry of reduced.values()) {
            const formatted = formatEntry(cache, entry)
            formatted && stream.push(formatted)
          }
        }).catch({ code: 'ENOENT' }, nop)
      })
    })
  }).then(() => {
    stream.push(null)
  }, err => {
    stream.emit('error', err)
  })

  return stream
}

module.exports.ls = ls
function ls (cache) {
  return BB.fromNode(cb => {
    lsStream(cache).on('error', cb).pipe(concat(entries => {
      cb(null, entries.reduce((acc, xs) => {
        acc[xs.key] = xs
        return acc
      }, {}))
    }))
  })
}

function bucketEntries (bucket, filter) {
  return readFileAsync(
    bucket, 'utf8'
  ).then(data => _bucketEntries(data, filter))
}

function bucketEntriesSync (bucket, filter) {
  const data = fs.readFileSync(bucket, 'utf8')
  return _bucketEntries(data, filter)
}

function _bucketEntries (data, filter) {
  let entries = []
  data.split('\n').forEach(entry => {
    if (!entry) { return }
    const pieces = entry.split('\t')
    if (!pieces[1] || hashEntry(pieces[1]) !== pieces[0]) {
      // Hash is no good! Corruption or malice? Doesn't matter!
      // EJECT EJECT
      return
    }
    let obj
    try {
      obj = JSON.parse(pieces[1])
    } catch (e) {
      // Entry is corrupted!
      return
    }
    if (obj) {
      entries.push(obj)
    }
  })
  return entries
}

module.exports._bucketDir = bucketDir
function bucketDir (cache) {
  return path.join(cache, `index-v${indexV}`)
}

module.exports._bucketPath = bucketPath
function bucketPath (cache, key) {
  const hashed = hashKey(key)
  return path.join.apply(path, [bucketDir(cache)].concat(
    hashToSegments(hashed)
  ))
}

module.exports._hashKey = hashKey
function hashKey (key) {
  return hash(key, 'sha256')
}

module.exports._hashEntry = hashEntry
function hashEntry (str) {
  return hash(str, 'sha1')
}

function hash (str, digest) {
  return crypto
    .createHash(digest)
    .update(str)
    .digest('hex')
}

function formatEntry (cache, entry) {
  // Treat null digests as deletions. They'll shadow any previous entries.
  if (!entry.integrity) { return null }
  return {
    key: entry.key,
    integrity: entry.integrity,
    path: contentPath(cache, entry.integrity),
    size: entry.size,
    time: entry.time,
    metadata: entry.metadata
  }
}

function readdirOrEmpty (dir) {
  return readdirAsync(dir)
    .catch({ code: 'ENOENT' }, () => [])
    .catch({ code: 'ENOTDIR' }, () => [])
}

function nop () {
}

}, function(modId) { var map = {"./content/path":1594707575887,"./util/fix-owner":1594707575890,"./util/hash-to-segments":1594707575889,"./util/y.js":1594707575891,"../package.json":1594707575888}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575887, function(require, module, exports) {
'use strict'

const contentVer = require('../../package.json')['cache-version'].content
const hashToSegments = require('../util/hash-to-segments')
const path = require('path')
const ssri = require('ssri')

// Current format of content file path:
//
// sha512-BaSE64Hex= ->
// ~/.my-cache/content-v2/sha512/ba/da/55deadbeefc0ffee
//
module.exports = contentPath
function contentPath (cache, integrity) {
  const sri = ssri.parse(integrity, { single: true })
  // contentPath is the *strongest* algo given
  return path.join.apply(path, [
    contentDir(cache),
    sri.algorithm
  ].concat(hashToSegments(sri.hexDigest())))
}

module.exports._contentDir = contentDir
function contentDir (cache) {
  return path.join(cache, `content-v${contentVer}`)
}

}, function(modId) { var map = {"../../package.json":1594707575888,"../util/hash-to-segments":1594707575889,"path":1594707575887}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575888, function(require, module, exports) {
module.exports = {
  "_from": "cacache@12.0.3",
  "_id": "cacache@12.0.3",
  "_inBundle": true,
  "_integrity": "sha512-kqdmfXEGFepesTuROHMs3MpFLWrPkSSpRqOw80RCflZXy/khxaArvFrQ7uJxSUduzAufc6G0g1VUCOZXxWavPw==",
  "_location": "/npm/cacache",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "cacache@12.0.3",
    "name": "cacache",
    "escapedName": "cacache",
    "rawSpec": "12.0.3",
    "saveSpec": null,
    "fetchSpec": "12.0.3"
  },
  "_requiredBy": [
    "/npm",
    "/npm/make-fetch-happen",
    "/npm/pacote"
  ],
  "_resolved": "https://registry.npmjs.org/cacache/-/cacache-12.0.3.tgz",
  "_shasum": "be99abba4e1bf5df461cd5a2c1071fc432573390",
  "_spec": "cacache@12.0.3",
  "_where": "/Users/isaacs/dev/npm/cli",
  "author": {
    "name": "Kat Marchán",
    "email": "kzm@sykosomatic.org"
  },
  "bugs": {
    "url": "https://github.com/npm/cacache/issues"
  },
  "cache-version": {
    "content": "2",
    "index": "5"
  },
  "config": {
    "nyc": {
      "exclude": [
        "node_modules/**",
        "test/**"
      ]
    }
  },
  "contributors": [
    {
      "name": "Charlotte Spencer",
      "email": "charlottelaspencer@gmail.com"
    },
    {
      "name": "Rebecca Turner",
      "email": "me@re-becca.org"
    }
  ],
  "dependencies": {
    "bluebird": "^3.5.5",
    "chownr": "^1.1.1",
    "figgy-pudding": "^3.5.1",
    "glob": "^7.1.4",
    "graceful-fs": "^4.1.15",
    "infer-owner": "^1.0.3",
    "lru-cache": "^5.1.1",
    "mississippi": "^3.0.0",
    "mkdirp": "^0.5.1",
    "move-concurrently": "^1.0.1",
    "promise-inflight": "^1.0.1",
    "rimraf": "^2.6.3",
    "ssri": "^6.0.1",
    "unique-filename": "^1.1.1",
    "y18n": "^4.0.0"
  },
  "deprecated": false,
  "description": "Fast, fault-tolerant, cross-platform, disk-based, data-agnostic, content-addressable cache.",
  "devDependencies": {
    "benchmark": "^2.1.4",
    "chalk": "^2.4.2",
    "cross-env": "^5.1.4",
    "require-inject": "^1.4.4",
    "standard": "^12.0.1",
    "standard-version": "^6.0.1",
    "tacks": "^1.3.0",
    "tap": "^12.7.0",
    "weallbehave": "^1.2.0",
    "weallcontribute": "^1.0.9"
  },
  "files": [
    "*.js",
    "lib",
    "locales"
  ],
  "homepage": "https://github.com/npm/cacache#readme",
  "keywords": [
    "cache",
    "caching",
    "content-addressable",
    "sri",
    "sri hash",
    "subresource integrity",
    "cache",
    "storage",
    "store",
    "file store",
    "filesystem",
    "disk cache",
    "disk storage"
  ],
  "license": "ISC",
  "main": "index.js",
  "name": "cacache",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/cacache.git"
  },
  "scripts": {
    "benchmarks": "node test/benchmarks",
    "postrelease": "npm publish && git push --follow-tags",
    "prerelease": "npm t",
    "pretest": "standard",
    "release": "standard-version -s",
    "test": "cross-env CACACHE_UPDATE_LOCALE_FILES=true tap --coverage --nyc-arg=--all -J test/*.js",
    "test-docker": "docker run -it --rm --name pacotest -v \"$PWD\":/tmp -w /tmp node:latest npm test",
    "update-coc": "weallbehave -o . && git add CODE_OF_CONDUCT.md && git commit -m 'docs(coc): updated CODE_OF_CONDUCT.md'",
    "update-contrib": "weallcontribute -o . && git add CONTRIBUTING.md && git commit -m 'docs(contributing): updated CONTRIBUTING.md'"
  },
  "version": "12.0.3"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575889, function(require, module, exports) {
'use strict'

module.exports = hashToSegments

function hashToSegments (hash) {
  return [
    hash.slice(0, 2),
    hash.slice(2, 4),
    hash.slice(4)
  ]
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575890, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const chownr = BB.promisify(require('chownr'))
const mkdirp = BB.promisify(require('mkdirp'))
const inflight = require('promise-inflight')
const inferOwner = require('infer-owner')

// Memoize getuid()/getgid() calls.
// patch process.setuid/setgid to invalidate cached value on change
const self = { uid: null, gid: null }
const getSelf = () => {
  if (typeof self.uid !== 'number') {
    self.uid = process.getuid()
    const setuid = process.setuid
    process.setuid = (uid) => {
      self.uid = null
      process.setuid = setuid
      return process.setuid(uid)
    }
  }
  if (typeof self.gid !== 'number') {
    self.gid = process.getgid()
    const setgid = process.setgid
    process.setgid = (gid) => {
      self.gid = null
      process.setgid = setgid
      return process.setgid(gid)
    }
  }
}

module.exports.chownr = fixOwner
function fixOwner (cache, filepath) {
  if (!process.getuid) {
    // This platform doesn't need ownership fixing
    return BB.resolve()
  }

  getSelf()
  if (self.uid !== 0) {
    // almost certainly can't chown anyway
    return BB.resolve()
  }

  return BB.resolve(inferOwner(cache)).then(owner => {
    const { uid, gid } = owner

    // No need to override if it's already what we used.
    if (self.uid === uid && self.gid === gid) {
      return
    }

    return inflight(
      'fixOwner: fixing ownership on ' + filepath,
      () => chownr(
        filepath,
        typeof uid === 'number' ? uid : self.uid,
        typeof gid === 'number' ? gid : self.gid
      ).catch({ code: 'ENOENT' }, () => null)
    )
  })
}

module.exports.chownr.sync = fixOwnerSync
function fixOwnerSync (cache, filepath) {
  if (!process.getuid) {
    // This platform doesn't need ownership fixing
    return
  }
  const { uid, gid } = inferOwner.sync(cache)
  getSelf()
  if (self.uid === uid && self.gid === gid) {
    // No need to override if it's already what we used.
    return
  }
  try {
    chownr.sync(
      filepath,
      typeof uid === 'number' ? uid : self.uid,
      typeof gid === 'number' ? gid : self.gid
    )
  } catch (err) {
    // only catch ENOENT, any other error is a problem.
    if (err.code === 'ENOENT') {
      return null
    }
    throw err
  }
}

module.exports.mkdirfix = mkdirfix
function mkdirfix (cache, p, cb) {
  // we have to infer the owner _before_ making the directory, even though
  // we aren't going to use the results, since the cache itself might not
  // exist yet.  If we mkdirp it, then our current uid/gid will be assumed
  // to be correct if it creates the cache folder in the process.
  return BB.resolve(inferOwner(cache)).then(() => {
    return mkdirp(p).then(made => {
      if (made) {
        return fixOwner(cache, made).then(() => made)
      }
    }).catch({ code: 'EEXIST' }, () => {
      // There's a race in mkdirp!
      return fixOwner(cache, p).then(() => null)
    })
  })
}

module.exports.mkdirfix.sync = mkdirfixSync
function mkdirfixSync (cache, p) {
  try {
    inferOwner.sync(cache)
    const made = mkdirp.sync(p)
    if (made) {
      fixOwnerSync(cache, made)
      return made
    }
  } catch (err) {
    if (err.code === 'EEXIST') {
      fixOwnerSync(cache, p)
      return null
    } else {
      throw err
    }
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575891, function(require, module, exports) {
'use strict'

const path = require('path')
const y18n = require('y18n')({
  directory: path.join(__dirname, '../../locales'),
  locale: 'en',
  updateFiles: process.env.CACACHE_UPDATE_LOCALE_FILES === 'true'
})

module.exports = yTag
function yTag (parts) {
  let str = ''
  parts.forEach((part, i) => {
    const arg = arguments[i + 1]
    str += part
    if (arg) {
      str += '%s'
    }
  })
  return y18n.__.apply(null, [str].concat([].slice.call(arguments, 1)))
}

module.exports.setLocale = locale => {
  y18n.setLocale(locale)
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575892, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const figgyPudding = require('figgy-pudding')
const fs = require('fs')
const index = require('./lib/entry-index')
const memo = require('./lib/memoization')
const pipe = require('mississippi').pipe
const pipeline = require('mississippi').pipeline
const read = require('./lib/content/read')
const through = require('mississippi').through

const GetOpts = figgyPudding({
  integrity: {},
  memoize: {},
  size: {}
})

module.exports = function get (cache, key, opts) {
  return getData(false, cache, key, opts)
}
module.exports.byDigest = function getByDigest (cache, digest, opts) {
  return getData(true, cache, digest, opts)
}
function getData (byDigest, cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = (
    byDigest
      ? memo.get.byDigest(cache, key, opts)
      : memo.get(cache, key, opts)
  )
  if (memoized && opts.memoize !== false) {
    return BB.resolve(byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    })
  }
  return (
    byDigest ? BB.resolve(null) : index.find(cache, key, opts)
  ).then(entry => {
    if (!entry && !byDigest) {
      throw new index.NotFoundError(cache, key)
    }
    return read(cache, byDigest ? key : entry.integrity, {
      integrity: opts.integrity,
      size: opts.size
    }).then(data => byDigest ? data : {
      metadata: entry.metadata,
      data: data,
      size: entry.size,
      integrity: entry.integrity
    }).then(res => {
      if (opts.memoize && byDigest) {
        memo.put.byDigest(cache, key, res, opts)
      } else if (opts.memoize) {
        memo.put(cache, entry, res.data, opts)
      }
      return res
    })
  })
}

module.exports.sync = function get (cache, key, opts) {
  return getDataSync(false, cache, key, opts)
}
module.exports.sync.byDigest = function getByDigest (cache, digest, opts) {
  return getDataSync(true, cache, digest, opts)
}
function getDataSync (byDigest, cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = (
    byDigest
      ? memo.get.byDigest(cache, key, opts)
      : memo.get(cache, key, opts)
  )
  if (memoized && opts.memoize !== false) {
    return byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    }
  }
  const entry = !byDigest && index.find.sync(cache, key, opts)
  if (!entry && !byDigest) {
    throw new index.NotFoundError(cache, key)
  }
  const data = read.sync(
    cache,
    byDigest ? key : entry.integrity,
    {
      integrity: opts.integrity,
      size: opts.size
    }
  )
  const res = byDigest
    ? data
    : {
      metadata: entry.metadata,
      data: data,
      size: entry.size,
      integrity: entry.integrity
    }
  if (opts.memoize && byDigest) {
    memo.put.byDigest(cache, key, res, opts)
  } else if (opts.memoize) {
    memo.put(cache, entry, res.data, opts)
  }
  return res
}

module.exports.stream = getStream
function getStream (cache, key, opts) {
  opts = GetOpts(opts)
  let stream = through()
  const memoized = memo.get(cache, key, opts)
  if (memoized && opts.memoize !== false) {
    stream.on('newListener', function (ev, cb) {
      ev === 'metadata' && cb(memoized.entry.metadata)
      ev === 'integrity' && cb(memoized.entry.integrity)
      ev === 'size' && cb(memoized.entry.size)
    })
    stream.write(memoized.data, () => stream.end())
    return stream
  }
  index.find(cache, key).then(entry => {
    if (!entry) {
      return stream.emit(
        'error', new index.NotFoundError(cache, key)
      )
    }
    let memoStream
    if (opts.memoize) {
      let memoData = []
      let memoLength = 0
      memoStream = through((c, en, cb) => {
        memoData && memoData.push(c)
        memoLength += c.length
        cb(null, c, en)
      }, cb => {
        memoData && memo.put(cache, entry, Buffer.concat(memoData, memoLength), opts)
        cb()
      })
    } else {
      memoStream = through()
    }
    stream.emit('metadata', entry.metadata)
    stream.emit('integrity', entry.integrity)
    stream.emit('size', entry.size)
    stream.on('newListener', function (ev, cb) {
      ev === 'metadata' && cb(entry.metadata)
      ev === 'integrity' && cb(entry.integrity)
      ev === 'size' && cb(entry.size)
    })
    pipe(
      read.readStream(cache, entry.integrity, opts.concat({
        size: opts.size == null ? entry.size : opts.size
      })),
      memoStream,
      stream
    )
  }).catch(err => stream.emit('error', err))
  return stream
}

module.exports.stream.byDigest = getStreamDigest
function getStreamDigest (cache, integrity, opts) {
  opts = GetOpts(opts)
  const memoized = memo.get.byDigest(cache, integrity, opts)
  if (memoized && opts.memoize !== false) {
    const stream = through()
    stream.write(memoized, () => stream.end())
    return stream
  } else {
    let stream = read.readStream(cache, integrity, opts)
    if (opts.memoize) {
      let memoData = []
      let memoLength = 0
      const memoStream = through((c, en, cb) => {
        memoData && memoData.push(c)
        memoLength += c.length
        cb(null, c, en)
      }, cb => {
        memoData && memo.put.byDigest(
          cache,
          integrity,
          Buffer.concat(memoData, memoLength),
          opts
        )
        cb()
      })
      stream = pipeline(stream, memoStream)
    }
    return stream
  }
}

module.exports.info = info
function info (cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = memo.get(cache, key, opts)
  if (memoized && opts.memoize !== false) {
    return BB.resolve(memoized.entry)
  } else {
    return index.find(cache, key)
  }
}

module.exports.hasContent = read.hasContent

module.exports.copy = function cp (cache, key, dest, opts) {
  return copy(false, cache, key, dest, opts)
}
module.exports.copy.byDigest = function cpDigest (cache, digest, dest, opts) {
  return copy(true, cache, digest, dest, opts)
}
function copy (byDigest, cache, key, dest, opts) {
  opts = GetOpts(opts)
  if (read.copy) {
    return (
      byDigest ? BB.resolve(null) : index.find(cache, key, opts)
    ).then(entry => {
      if (!entry && !byDigest) {
        throw new index.NotFoundError(cache, key)
      }
      return read.copy(
        cache, byDigest ? key : entry.integrity, dest, opts
      ).then(() => byDigest ? key : {
        metadata: entry.metadata,
        size: entry.size,
        integrity: entry.integrity
      })
    })
  } else {
    return getData(byDigest, cache, key, opts).then(res => {
      return fs.writeFileAsync(dest, byDigest ? res : res.data)
        .then(() => byDigest ? key : {
          metadata: res.metadata,
          size: res.size,
          integrity: res.integrity
        })
    })
  }
}

}, function(modId) { var map = {"./lib/entry-index":1594707575886,"./lib/memoization":1594707575893,"./lib/content/read":1594707575894}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575893, function(require, module, exports) {
'use strict'

const LRU = require('lru-cache')

const MAX_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_AGE = 3 * 60 * 1000

let MEMOIZED = new LRU({
  max: MAX_SIZE,
  maxAge: MAX_AGE,
  length: (entry, key) => {
    if (key.startsWith('key:')) {
      return entry.data.length
    } else if (key.startsWith('digest:')) {
      return entry.length
    }
  }
})

module.exports.clearMemoized = clearMemoized
function clearMemoized () {
  const old = {}
  MEMOIZED.forEach((v, k) => {
    old[k] = v
  })
  MEMOIZED.reset()
  return old
}

module.exports.put = put
function put (cache, entry, data, opts) {
  pickMem(opts).set(`key:${cache}:${entry.key}`, { entry, data })
  putDigest(cache, entry.integrity, data, opts)
}

module.exports.put.byDigest = putDigest
function putDigest (cache, integrity, data, opts) {
  pickMem(opts).set(`digest:${cache}:${integrity}`, data)
}

module.exports.get = get
function get (cache, key, opts) {
  return pickMem(opts).get(`key:${cache}:${key}`)
}

module.exports.get.byDigest = getDigest
function getDigest (cache, integrity, opts) {
  return pickMem(opts).get(`digest:${cache}:${integrity}`)
}

class ObjProxy {
  constructor (obj) {
    this.obj = obj
  }
  get (key) { return this.obj[key] }
  set (key, val) { this.obj[key] = val }
}

function pickMem (opts) {
  if (!opts || !opts.memoize) {
    return MEMOIZED
  } else if (opts.memoize.get && opts.memoize.set) {
    return opts.memoize
  } else if (typeof opts.memoize === 'object') {
    return new ObjProxy(opts.memoize)
  } else {
    return MEMOIZED
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575894, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const contentPath = require('./path')
const figgyPudding = require('figgy-pudding')
const fs = require('graceful-fs')
const PassThrough = require('stream').PassThrough
const pipe = BB.promisify(require('mississippi').pipe)
const ssri = require('ssri')
const Y = require('../util/y.js')

const lstatAsync = BB.promisify(fs.lstat)
const readFileAsync = BB.promisify(fs.readFile)

const ReadOpts = figgyPudding({
  size: {}
})

module.exports = read
function read (cache, integrity, opts) {
  opts = ReadOpts(opts)
  return withContentSri(cache, integrity, (cpath, sri) => {
    return readFileAsync(cpath, null).then(data => {
      if (typeof opts.size === 'number' && opts.size !== data.length) {
        throw sizeError(opts.size, data.length)
      } else if (ssri.checkData(data, sri)) {
        return data
      } else {
        throw integrityError(sri, cpath)
      }
    })
  })
}

module.exports.sync = readSync
function readSync (cache, integrity, opts) {
  opts = ReadOpts(opts)
  return withContentSriSync(cache, integrity, (cpath, sri) => {
    const data = fs.readFileSync(cpath)
    if (typeof opts.size === 'number' && opts.size !== data.length) {
      throw sizeError(opts.size, data.length)
    } else if (ssri.checkData(data, sri)) {
      return data
    } else {
      throw integrityError(sri, cpath)
    }
  })
}

module.exports.stream = readStream
module.exports.readStream = readStream
function readStream (cache, integrity, opts) {
  opts = ReadOpts(opts)
  const stream = new PassThrough()
  withContentSri(cache, integrity, (cpath, sri) => {
    return lstatAsync(cpath).then(stat => ({ cpath, sri, stat }))
  }).then(({ cpath, sri, stat }) => {
    return pipe(
      fs.createReadStream(cpath),
      ssri.integrityStream({
        integrity: sri,
        size: opts.size
      }),
      stream
    )
  }).catch(err => {
    stream.emit('error', err)
  })
  return stream
}

let copyFileAsync
if (fs.copyFile) {
  module.exports.copy = copy
  module.exports.copy.sync = copySync
  copyFileAsync = BB.promisify(fs.copyFile)
}

function copy (cache, integrity, dest, opts) {
  opts = ReadOpts(opts)
  return withContentSri(cache, integrity, (cpath, sri) => {
    return copyFileAsync(cpath, dest)
  })
}

function copySync (cache, integrity, dest, opts) {
  opts = ReadOpts(opts)
  return withContentSriSync(cache, integrity, (cpath, sri) => {
    return fs.copyFileSync(cpath, dest)
  })
}

module.exports.hasContent = hasContent
function hasContent (cache, integrity) {
  if (!integrity) { return BB.resolve(false) }
  return withContentSri(cache, integrity, (cpath, sri) => {
    return lstatAsync(cpath).then(stat => ({ size: stat.size, sri, stat }))
  }).catch(err => {
    if (err.code === 'ENOENT') { return false }
    if (err.code === 'EPERM') {
      if (process.platform !== 'win32') {
        throw err
      } else {
        return false
      }
    }
  })
}

module.exports.hasContent.sync = hasContentSync
function hasContentSync (cache, integrity) {
  if (!integrity) { return false }
  return withContentSriSync(cache, integrity, (cpath, sri) => {
    try {
      const stat = fs.lstatSync(cpath)
      return { size: stat.size, sri, stat }
    } catch (err) {
      if (err.code === 'ENOENT') { return false }
      if (err.code === 'EPERM') {
        if (process.platform !== 'win32') {
          throw err
        } else {
          return false
        }
      }
    }
  })
}

function withContentSri (cache, integrity, fn) {
  return BB.try(() => {
    const sri = ssri.parse(integrity)
    // If `integrity` has multiple entries, pick the first digest
    // with available local data.
    const algo = sri.pickAlgorithm()
    const digests = sri[algo]
    if (digests.length <= 1) {
      const cpath = contentPath(cache, digests[0])
      return fn(cpath, digests[0])
    } else {
      return BB.any(sri[sri.pickAlgorithm()].map(meta => {
        return withContentSri(cache, meta, fn)
      }, { concurrency: 1 }))
        .catch(err => {
          if ([].some.call(err, e => e.code === 'ENOENT')) {
            throw Object.assign(
              new Error('No matching content found for ' + sri.toString()),
              { code: 'ENOENT' }
            )
          } else {
            throw err[0]
          }
        })
    }
  })
}

function withContentSriSync (cache, integrity, fn) {
  const sri = ssri.parse(integrity)
  // If `integrity` has multiple entries, pick the first digest
  // with available local data.
  const algo = sri.pickAlgorithm()
  const digests = sri[algo]
  if (digests.length <= 1) {
    const cpath = contentPath(cache, digests[0])
    return fn(cpath, digests[0])
  } else {
    let lastErr = null
    for (const meta of sri[sri.pickAlgorithm()]) {
      try {
        return withContentSriSync(cache, meta, fn)
      } catch (err) {
        lastErr = err
      }
    }
    if (lastErr) { throw lastErr }
  }
}

function sizeError (expected, found) {
  var err = new Error(Y`Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`)
  err.expected = expected
  err.found = found
  err.code = 'EBADSIZE'
  return err
}

function integrityError (sri, path) {
  var err = new Error(Y`Integrity verification failed for ${sri} (${path})`)
  err.code = 'EINTEGRITY'
  err.sri = sri
  err.path = path
  return err
}

}, function(modId) { var map = {"./path":1594707575887,"../util/y.js":1594707575891}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575895, function(require, module, exports) {
'use strict'

const figgyPudding = require('figgy-pudding')
const index = require('./lib/entry-index')
const memo = require('./lib/memoization')
const write = require('./lib/content/write')
const to = require('mississippi').to

const PutOpts = figgyPudding({
  algorithms: {
    default: ['sha512']
  },
  integrity: {},
  memoize: {},
  metadata: {},
  pickAlgorithm: {},
  size: {},
  tmpPrefix: {},
  single: {},
  sep: {},
  error: {},
  strict: {}
})

module.exports = putData
function putData (cache, key, data, opts) {
  opts = PutOpts(opts)
  return write(cache, data, opts).then(res => {
    return index.insert(
      cache, key, res.integrity, opts.concat({ size: res.size })
    ).then(entry => {
      if (opts.memoize) {
        memo.put(cache, entry, data, opts)
      }
      return res.integrity
    })
  })
}

module.exports.stream = putStream
function putStream (cache, key, opts) {
  opts = PutOpts(opts)
  let integrity
  let size
  const contentStream = write.stream(
    cache, opts
  ).on('integrity', int => {
    integrity = int
  }).on('size', s => {
    size = s
  })
  let memoData
  let memoTotal = 0
  const stream = to((chunk, enc, cb) => {
    contentStream.write(chunk, enc, () => {
      if (opts.memoize) {
        if (!memoData) { memoData = [] }
        memoData.push(chunk)
        memoTotal += chunk.length
      }
      cb()
    })
  }, cb => {
    contentStream.end(() => {
      index.insert(cache, key, integrity, opts.concat({ size })).then(entry => {
        if (opts.memoize) {
          memo.put(cache, entry, Buffer.concat(memoData, memoTotal), opts)
        }
        stream.emit('integrity', integrity)
        cb()
      })
    })
  })
  let erred = false
  stream.once('error', err => {
    if (erred) { return }
    erred = true
    contentStream.emit('error', err)
  })
  contentStream.once('error', err => {
    if (erred) { return }
    erred = true
    stream.emit('error', err)
  })
  return stream
}

}, function(modId) { var map = {"./lib/entry-index":1594707575886,"./lib/memoization":1594707575893,"./lib/content/write":1594707575896}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575896, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const contentPath = require('./path')
const fixOwner = require('../util/fix-owner')
const fs = require('graceful-fs')
const moveFile = require('../util/move-file')
const PassThrough = require('stream').PassThrough
const path = require('path')
const pipe = BB.promisify(require('mississippi').pipe)
const rimraf = BB.promisify(require('rimraf'))
const ssri = require('ssri')
const to = require('mississippi').to
const uniqueFilename = require('unique-filename')
const Y = require('../util/y.js')

const writeFileAsync = BB.promisify(fs.writeFile)

module.exports = write
function write (cache, data, opts) {
  opts = opts || {}
  if (opts.algorithms && opts.algorithms.length > 1) {
    throw new Error(
      Y`opts.algorithms only supports a single algorithm for now`
    )
  }
  if (typeof opts.size === 'number' && data.length !== opts.size) {
    return BB.reject(sizeError(opts.size, data.length))
  }
  const sri = ssri.fromData(data, {
    algorithms: opts.algorithms
  })
  if (opts.integrity && !ssri.checkData(data, opts.integrity, opts)) {
    return BB.reject(checksumError(opts.integrity, sri))
  }
  return BB.using(makeTmp(cache, opts), tmp => (
    writeFileAsync(
      tmp.target, data, { flag: 'wx' }
    ).then(() => (
      moveToDestination(tmp, cache, sri, opts)
    ))
  )).then(() => ({ integrity: sri, size: data.length }))
}

module.exports.stream = writeStream
function writeStream (cache, opts) {
  opts = opts || {}
  const inputStream = new PassThrough()
  let inputErr = false
  function errCheck () {
    if (inputErr) { throw inputErr }
  }

  let allDone
  const ret = to((c, n, cb) => {
    if (!allDone) {
      allDone = handleContent(inputStream, cache, opts, errCheck)
    }
    inputStream.write(c, n, cb)
  }, cb => {
    inputStream.end(() => {
      if (!allDone) {
        const e = new Error(Y`Cache input stream was empty`)
        e.code = 'ENODATA'
        return ret.emit('error', e)
      }
      allDone.then(res => {
        res.integrity && ret.emit('integrity', res.integrity)
        res.size !== null && ret.emit('size', res.size)
        cb()
      }, e => {
        ret.emit('error', e)
      })
    })
  })
  ret.once('error', e => {
    inputErr = e
  })
  return ret
}

function handleContent (inputStream, cache, opts, errCheck) {
  return BB.using(makeTmp(cache, opts), tmp => {
    errCheck()
    return pipeToTmp(
      inputStream, cache, tmp.target, opts, errCheck
    ).then(res => {
      return moveToDestination(
        tmp, cache, res.integrity, opts, errCheck
      ).then(() => res)
    })
  })
}

function pipeToTmp (inputStream, cache, tmpTarget, opts, errCheck) {
  return BB.resolve().then(() => {
    let integrity
    let size
    const hashStream = ssri.integrityStream({
      integrity: opts.integrity,
      algorithms: opts.algorithms,
      size: opts.size
    }).on('integrity', s => {
      integrity = s
    }).on('size', s => {
      size = s
    })
    const outStream = fs.createWriteStream(tmpTarget, {
      flags: 'wx'
    })
    errCheck()
    return pipe(inputStream, hashStream, outStream).then(() => {
      return { integrity, size }
    }).catch(err => {
      return rimraf(tmpTarget).then(() => { throw err })
    })
  })
}

function makeTmp (cache, opts) {
  const tmpTarget = uniqueFilename(path.join(cache, 'tmp'), opts.tmpPrefix)
  return fixOwner.mkdirfix(
    cache, path.dirname(tmpTarget)
  ).then(() => ({
    target: tmpTarget,
    moved: false
  })).disposer(tmp => (!tmp.moved && rimraf(tmp.target)))
}

function moveToDestination (tmp, cache, sri, opts, errCheck) {
  errCheck && errCheck()
  const destination = contentPath(cache, sri)
  const destDir = path.dirname(destination)

  return fixOwner.mkdirfix(
    cache, destDir
  ).then(() => {
    errCheck && errCheck()
    return moveFile(tmp.target, destination)
  }).then(() => {
    errCheck && errCheck()
    tmp.moved = true
    return fixOwner.chownr(cache, destination)
  })
}

function sizeError (expected, found) {
  var err = new Error(Y`Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`)
  err.expected = expected
  err.found = found
  err.code = 'EBADSIZE'
  return err
}

function checksumError (expected, found) {
  var err = new Error(Y`Integrity check failed:
  Wanted: ${expected}
   Found: ${found}`)
  err.code = 'EINTEGRITY'
  err.expected = expected
  err.found = found
  return err
}

}, function(modId) { var map = {"./path":1594707575887,"../util/fix-owner":1594707575890,"../util/move-file":1594707575897,"path":1594707575887,"../util/y.js":1594707575891}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575897, function(require, module, exports) {
'use strict'

const fs = require('graceful-fs')
const BB = require('bluebird')
const chmod = BB.promisify(fs.chmod)
const unlink = BB.promisify(fs.unlink)
let move
let pinflight

module.exports = moveFile
function moveFile (src, dest) {
  // This isn't quite an fs.rename -- the assumption is that
  // if `dest` already exists, and we get certain errors while
  // trying to move it, we should just not bother.
  //
  // In the case of cache corruption, users will receive an
  // EINTEGRITY error elsewhere, and can remove the offending
  // content their own way.
  //
  // Note that, as the name suggests, this strictly only supports file moves.
  return BB.fromNode(cb => {
    fs.link(src, dest, err => {
      if (err) {
        if (err.code === 'EEXIST' || err.code === 'EBUSY') {
          // file already exists, so whatever
        } else if (err.code === 'EPERM' && process.platform === 'win32') {
          // file handle stayed open even past graceful-fs limits
        } else {
          return cb(err)
        }
      }
      return cb()
    })
  }).then(() => {
    // content should never change for any reason, so make it read-only
    return BB.join(unlink(src), process.platform !== 'win32' && chmod(dest, '0444'))
  }).catch(() => {
    if (!pinflight) { pinflight = require('promise-inflight') }
    return pinflight('cacache-move-file:' + dest, () => {
      return BB.promisify(fs.stat)(dest).catch(err => {
        if (err.code !== 'ENOENT') {
          // Something else is wrong here. Bail bail bail
          throw err
        }
        // file doesn't already exist! let's try a rename -> copy fallback
        if (!move) { move = require('move-concurrently') }
        return move(src, dest, { BB, fs })
      })
    })
  })
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575898, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const index = require('./lib/entry-index')
const memo = require('./lib/memoization')
const path = require('path')
const rimraf = BB.promisify(require('rimraf'))
const rmContent = require('./lib/content/rm')

module.exports = entry
module.exports.entry = entry
function entry (cache, key) {
  memo.clearMemoized()
  return index.delete(cache, key)
}

module.exports.content = content
function content (cache, integrity) {
  memo.clearMemoized()
  return rmContent(cache, integrity)
}

module.exports.all = all
function all (cache) {
  memo.clearMemoized()
  return rimraf(path.join(cache, '*(content-*|index-*)'))
}

}, function(modId) { var map = {"./lib/entry-index":1594707575886,"./lib/memoization":1594707575893,"./lib/content/rm":1594707575899}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575899, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const contentPath = require('./path')
const hasContent = require('./read').hasContent
const rimraf = BB.promisify(require('rimraf'))

module.exports = rm
function rm (cache, integrity) {
  return hasContent(cache, integrity).then(content => {
    if (content) {
      const sri = content.sri
      if (sri) {
        return rimraf(contentPath(cache, sri)).then(() => true)
      }
    } else {
      return false
    }
  })
}

}, function(modId) { var map = {"./path":1594707575887,"./read":1594707575894}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575900, function(require, module, exports) {
'use strict'

module.exports = require('./lib/verify')

}, function(modId) { var map = {"./lib/verify":1594707575901}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575901, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const contentPath = require('./content/path')
const figgyPudding = require('figgy-pudding')
const finished = BB.promisify(require('mississippi').finished)
const fixOwner = require('./util/fix-owner')
const fs = require('graceful-fs')
const glob = BB.promisify(require('glob'))
const index = require('./entry-index')
const path = require('path')
const rimraf = BB.promisify(require('rimraf'))
const ssri = require('ssri')

BB.promisifyAll(fs)

const VerifyOpts = figgyPudding({
  concurrency: {
    default: 20
  },
  filter: {},
  log: {
    default: { silly () {} }
  }
})

module.exports = verify
function verify (cache, opts) {
  opts = VerifyOpts(opts)
  opts.log.silly('verify', 'verifying cache at', cache)
  return BB.reduce([
    markStartTime,
    fixPerms,
    garbageCollect,
    rebuildIndex,
    cleanTmp,
    writeVerifile,
    markEndTime
  ], (stats, step, i) => {
    const label = step.name || `step #${i}`
    const start = new Date()
    return BB.resolve(step(cache, opts)).then(s => {
      s && Object.keys(s).forEach(k => {
        stats[k] = s[k]
      })
      const end = new Date()
      if (!stats.runTime) { stats.runTime = {} }
      stats.runTime[label] = end - start
      return stats
    })
  }, {}).tap(stats => {
    stats.runTime.total = stats.endTime - stats.startTime
    opts.log.silly('verify', 'verification finished for', cache, 'in', `${stats.runTime.total}ms`)
  })
}

function markStartTime (cache, opts) {
  return { startTime: new Date() }
}

function markEndTime (cache, opts) {
  return { endTime: new Date() }
}

function fixPerms (cache, opts) {
  opts.log.silly('verify', 'fixing cache permissions')
  return fixOwner.mkdirfix(cache, cache).then(() => {
    // TODO - fix file permissions too
    return fixOwner.chownr(cache, cache)
  }).then(() => null)
}

// Implements a naive mark-and-sweep tracing garbage collector.
//
// The algorithm is basically as follows:
// 1. Read (and filter) all index entries ("pointers")
// 2. Mark each integrity value as "live"
// 3. Read entire filesystem tree in `content-vX/` dir
// 4. If content is live, verify its checksum and delete it if it fails
// 5. If content is not marked as live, rimraf it.
//
function garbageCollect (cache, opts) {
  opts.log.silly('verify', 'garbage collecting content')
  const indexStream = index.lsStream(cache)
  const liveContent = new Set()
  indexStream.on('data', entry => {
    if (opts.filter && !opts.filter(entry)) { return }
    liveContent.add(entry.integrity.toString())
  })
  return finished(indexStream).then(() => {
    const contentDir = contentPath._contentDir(cache)
    return glob(path.join(contentDir, '**'), {
      follow: false,
      nodir: true,
      nosort: true
    }).then(files => {
      return BB.resolve({
        verifiedContent: 0,
        reclaimedCount: 0,
        reclaimedSize: 0,
        badContentCount: 0,
        keptSize: 0
      }).tap((stats) => BB.map(files, (f) => {
        const split = f.split(/[/\\]/)
        const digest = split.slice(split.length - 3).join('')
        const algo = split[split.length - 4]
        const integrity = ssri.fromHex(digest, algo)
        if (liveContent.has(integrity.toString())) {
          return verifyContent(f, integrity).then(info => {
            if (!info.valid) {
              stats.reclaimedCount++
              stats.badContentCount++
              stats.reclaimedSize += info.size
            } else {
              stats.verifiedContent++
              stats.keptSize += info.size
            }
            return stats
          })
        } else {
          // No entries refer to this content. We can delete.
          stats.reclaimedCount++
          return fs.statAsync(f).then(s => {
            return rimraf(f).then(() => {
              stats.reclaimedSize += s.size
              return stats
            })
          })
        }
      }, { concurrency: opts.concurrency }))
    })
  })
}

function verifyContent (filepath, sri) {
  return fs.statAsync(filepath).then(stat => {
    const contentInfo = {
      size: stat.size,
      valid: true
    }
    return ssri.checkStream(
      fs.createReadStream(filepath),
      sri
    ).catch(err => {
      if (err.code !== 'EINTEGRITY') { throw err }
      return rimraf(filepath).then(() => {
        contentInfo.valid = false
      })
    }).then(() => contentInfo)
  }).catch({ code: 'ENOENT' }, () => ({ size: 0, valid: false }))
}

function rebuildIndex (cache, opts) {
  opts.log.silly('verify', 'rebuilding index')
  return index.ls(cache).then(entries => {
    const stats = {
      missingContent: 0,
      rejectedEntries: 0,
      totalEntries: 0
    }
    const buckets = {}
    for (let k in entries) {
      if (entries.hasOwnProperty(k)) {
        const hashed = index._hashKey(k)
        const entry = entries[k]
        const excluded = opts.filter && !opts.filter(entry)
        excluded && stats.rejectedEntries++
        if (buckets[hashed] && !excluded) {
          buckets[hashed].push(entry)
        } else if (buckets[hashed] && excluded) {
          // skip
        } else if (excluded) {
          buckets[hashed] = []
          buckets[hashed]._path = index._bucketPath(cache, k)
        } else {
          buckets[hashed] = [entry]
          buckets[hashed]._path = index._bucketPath(cache, k)
        }
      }
    }
    return BB.map(Object.keys(buckets), key => {
      return rebuildBucket(cache, buckets[key], stats, opts)
    }, { concurrency: opts.concurrency }).then(() => stats)
  })
}

function rebuildBucket (cache, bucket, stats, opts) {
  return fs.truncateAsync(bucket._path).then(() => {
    // This needs to be serialized because cacache explicitly
    // lets very racy bucket conflicts clobber each other.
    return BB.mapSeries(bucket, entry => {
      const content = contentPath(cache, entry.integrity)
      return fs.statAsync(content).then(() => {
        return index.insert(cache, entry.key, entry.integrity, {
          metadata: entry.metadata,
          size: entry.size
        }).then(() => { stats.totalEntries++ })
      }).catch({ code: 'ENOENT' }, () => {
        stats.rejectedEntries++
        stats.missingContent++
      })
    })
  })
}

function cleanTmp (cache, opts) {
  opts.log.silly('verify', 'cleaning tmp directory')
  return rimraf(path.join(cache, 'tmp'))
}

function writeVerifile (cache, opts) {
  const verifile = path.join(cache, '_lastverified')
  opts.log.silly('verify', 'writing verifile to ' + verifile)
  try {
    return fs.writeFileAsync(verifile, '' + (+(new Date())))
  } finally {
    fixOwner.chownr.sync(cache, verifile)
  }
}

module.exports.lastRun = lastRun
function lastRun (cache) {
  return fs.readFileAsync(
    path.join(cache, '_lastverified'), 'utf8'
  ).then(data => new Date(+data))
}

}, function(modId) { var map = {"./content/path":1594707575887,"./util/fix-owner":1594707575890,"./entry-index":1594707575886}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575902, function(require, module, exports) {
'use strict'

const BB = require('bluebird')

const figgyPudding = require('figgy-pudding')
const fixOwner = require('./fix-owner')
const path = require('path')
const rimraf = BB.promisify(require('rimraf'))
const uniqueFilename = require('unique-filename')

const TmpOpts = figgyPudding({
  tmpPrefix: {}
})

module.exports.mkdir = mktmpdir
function mktmpdir (cache, opts) {
  opts = TmpOpts(opts)
  const tmpTarget = uniqueFilename(path.join(cache, 'tmp'), opts.tmpPrefix)
  return fixOwner.mkdirfix(cache, tmpTarget).then(() => {
    return tmpTarget
  })
}

module.exports.withTmp = withTmp
function withTmp (cache, opts, cb) {
  if (!cb) {
    cb = opts
    opts = null
  }
  opts = TmpOpts(opts)
  return BB.using(mktmpdir(cache, opts).disposer(rimraf), cb)
}

module.exports.fix = fixtmpdir
function fixtmpdir (cache) {
  return fixOwner(cache, path.join(cache, 'tmp'))
}

}, function(modId) { var map = {"./fix-owner":1594707575890}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575883);
})()
//# sourceMappingURL=index.js.map