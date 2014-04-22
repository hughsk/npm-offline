var readJSON = require('read-package-json')
var path = require('path')
var sha = require('sha')
var url = require('url')
var fs = require('fs')

module.exports = versionInfo

function versionInfo(cache, fallback) {
  return function handle(req, res, next) {
    var version = this.version
    var name = this.module

    var pkgFolder = path.resolve(cache, name)
    var currentPath = path.join(pkgFolder, version, 'package')
    var currentPackage = path.join(currentPath, 'package.json')
    var currentTarball = path.join(pkgFolder, version, 'package.tgz')

    if (!fs.existsSync(currentTarball)) return next()
    if (!fs.existsSync(currentPackage)) return next()

    readJSON(currentPackage, function(err, pkg) {
      if (err) return next(err)

      pkg.dependencies = pkg.dependencies || {}
      pkg.devDependencies = pkg.devDependencies || {}
      pkg.peerDependencies = pkg.peerDependencies || {}

      sha.get(currentTarball, function(err, sum) {
        if (err) return next(err)

        var props = {
            host: req.headers.host
          , pathname: name + '/' + version + '/tarball'
          , protocol: 'http'
        }

        pkg.dist = {
            shasum: sum
          , tarball: url.format(props)
        }

        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(pkg))
      })

    })
  }
}
