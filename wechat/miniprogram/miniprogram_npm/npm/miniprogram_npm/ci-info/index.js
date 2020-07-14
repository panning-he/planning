module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1594707575910, function(require, module, exports) {
'use strict'

var vendors = require('./vendors.json')

var env = process.env

// Used for testing only
Object.defineProperty(exports, '_vendors', {
  value: vendors.map(function (v) { return v.constant })
})

exports.name = null
exports.isPR = null

vendors.forEach(function (vendor) {
  var envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env]
  var isCI = envs.every(function (obj) {
    return checkEnv(obj)
  })

  exports[vendor.constant] = isCI

  if (isCI) {
    exports.name = vendor.name

    switch (typeof vendor.pr) {
      case 'string':
        // "pr": "CIRRUS_PR"
        exports.isPR = !!env[vendor.pr]
        break
      case 'object':
        if ('env' in vendor.pr) {
          // "pr": { "env": "BUILDKITE_PULL_REQUEST", "ne": "false" }
          exports.isPR = vendor.pr.env in env && env[vendor.pr.env] !== vendor.pr.ne
        } else if ('any' in vendor.pr) {
          // "pr": { "any": ["ghprbPullId", "CHANGE_ID"] }
          exports.isPR = vendor.pr.any.some(function (key) {
            return !!env[key]
          })
        } else {
          // "pr": { "DRONE_BUILD_EVENT": "pull_request" }
          exports.isPR = checkEnv(vendor.pr)
        }
        break
      default:
        // PR detection not supported for this vendor
        exports.isPR = null
    }
  }
})

exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false
)

function checkEnv (obj) {
  if (typeof obj === 'string') return !!env[obj]
  return Object.keys(obj).every(function (k) {
    return env[k] === obj[k]
  })
}

}, function(modId) {var map = {"./vendors.json":1594707575911}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1594707575911, function(require, module, exports) {
module.exports = [
  {
    "name": "AppVeyor",
    "constant": "APPVEYOR",
    "env": "APPVEYOR",
    "pr": "APPVEYOR_PULL_REQUEST_NUMBER"
  },
  {
    "name": "Azure Pipelines",
    "constant": "AZURE_PIPELINES",
    "env": "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI",
    "pr": "SYSTEM_PULLREQUEST_PULLREQUESTID"
  },
  {
    "name": "Bamboo",
    "constant": "BAMBOO",
    "env": "bamboo_planKey"
  },
  {
    "name": "Bitbucket Pipelines",
    "constant": "BITBUCKET",
    "env": "BITBUCKET_COMMIT",
    "pr": "BITBUCKET_PR_ID"
  },
  {
    "name": "Bitrise",
    "constant": "BITRISE",
    "env": "BITRISE_IO",
    "pr": "BITRISE_PULL_REQUEST"
  },
  {
    "name": "Buddy",
    "constant": "BUDDY",
    "env": "BUDDY_WORKSPACE_ID",
    "pr": "BUDDY_EXECUTION_PULL_REQUEST_ID"
  },
  {
    "name": "Buildkite",
    "constant": "BUILDKITE",
    "env": "BUILDKITE",
    "pr": { "env": "BUILDKITE_PULL_REQUEST", "ne": "false" }
  },
  {
    "name": "CircleCI",
    "constant": "CIRCLE",
    "env": "CIRCLECI",
    "pr": "CIRCLE_PULL_REQUEST"
  },
  {
    "name": "Cirrus CI",
    "constant": "CIRRUS",
    "env": "CIRRUS_CI",
    "pr": "CIRRUS_PR"
  },
  {
    "name": "AWS CodeBuild",
    "constant": "CODEBUILD",
    "env": "CODEBUILD_BUILD_ARN"
  },
  {
    "name": "Codeship",
    "constant": "CODESHIP",
    "env": { "CI_NAME": "codeship" }
  },
  {
    "name": "Drone",
    "constant": "DRONE",
    "env": "DRONE",
    "pr": { "DRONE_BUILD_EVENT": "pull_request" }
  },
  {
    "name": "dsari",
    "constant": "DSARI",
    "env": "DSARI"
  },
  {
    "name": "GitLab CI",
    "constant": "GITLAB",
    "env": "GITLAB_CI"
  },
  {
    "name": "GoCD",
    "constant": "GOCD",
    "env": "GO_PIPELINE_LABEL"
  },
  {
    "name": "Hudson",
    "constant": "HUDSON",
    "env": "HUDSON_URL"
  },
  {
    "name": "Jenkins",
    "constant": "JENKINS",
    "env": ["JENKINS_URL", "BUILD_ID"],
    "pr": { "any": ["ghprbPullId", "CHANGE_ID"] }
  },
  {
    "name": "Magnum CI",
    "constant": "MAGNUM",
    "env": "MAGNUM"
  },
  {
    "name": "Netlify CI",
    "constant": "NETLIFY",
    "env": "NETLIFY_BUILD_BASE",
    "pr": { "env": "PULL_REQUEST", "ne": "false" }
  },
  {
    "name": "Sail CI",
    "constant": "SAIL",
    "env": "SAILCI",
    "pr": "SAIL_PULL_REQUEST_NUMBER"
  },
  {
    "name": "Semaphore",
    "constant": "SEMAPHORE",
    "env": "SEMAPHORE",
    "pr": "PULL_REQUEST_NUMBER"
  },
  {
    "name": "Shippable",
    "constant": "SHIPPABLE",
    "env": "SHIPPABLE",
    "pr": { "IS_PULL_REQUEST": "true" }
  },
  {
    "name": "Solano CI",
    "constant": "SOLANO",
    "env": "TDDIUM",
    "pr": "TDDIUM_PR_ID"
  },
  {
    "name": "Strider CD",
    "constant": "STRIDER",
    "env": "STRIDER"
  },
  {
    "name": "TaskCluster",
    "constant": "TASKCLUSTER",
    "env": ["TASK_ID", "RUN_ID"]
  },
  {
    "name": "TeamCity",
    "constant": "TEAMCITY",
    "env": "TEAMCITY_VERSION"
  },
  {
    "name": "Travis CI",
    "constant": "TRAVIS",
    "env": "TRAVIS",
    "pr": { "env": "TRAVIS_PULL_REQUEST", "ne": "false" }
  }
]

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1594707575910);
})()
//# sourceMappingURL=index.js.map