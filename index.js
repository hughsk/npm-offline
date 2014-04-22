var request = require('request')
var course = require('course')
var url = require('url')

var versionInfo = require('./routes/version-info')
var versionTarball = require('./routes/version-tarball')
var moduleData = require('./lib/module-data')

module.exports = createServer

function createServer(cache, fallback) {
  var getModule = moduleData(cache, fallback)
  var router = course()

  router.get('/:module/:version', versionInfo(cache, fallback))
  router.get('/:module/:version/tarball', versionTarball(cache, fallback))
  router.get('/:module', function(req, res, next) {
    var name = this.module

    getModule(name, function(err, pkg) {
      if (err) throw err
      if (!pkg) return next()

      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(pkg))
    })
  })

  return function registryResponse(req, res) {
    router(req, res, function(err) {
      if (err) {
        res.statusCode = 500
        res.end([err.message, err.stack].join('\n'))
        return
      }

      var proxied = url.resolve(fallback, req.url)
      var method = req.method.toLowerCase()

      return request[method](proxied).pipe(res)
    })
  }
}
