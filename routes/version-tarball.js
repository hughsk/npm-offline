var path = require('path')
var fs = require('fs')

module.exports = versionTarball

function versionTarball(cache, fallback) {
  return function handle(req, res, next) {
    var version = this.version
    var name = this.module

    var pkgFolder = path.resolve(cache, name)
    var currentPath = path.join(pkgFolder, version, 'package')
    var currentPackage = path.join(currentPath, 'package.json')
    var currentTarball = path.join(pkgFolder, version, 'package.tgz')

    if (!fs.existsSync(currentPackage)) return next()
    if (!fs.existsSync(currentTarball)) return next()

    fs.createReadStream(currentTarball)
      .pipe(res)
  }
}
