var readJSON = require('read-package-json')
var map = require('map-async')
var semver = require('semver')
var path = require('path')
var fs = require('fs')

module.exports = moduleData

function moduleData(cache, fallback) {
  var modules = {}

  return function getModule(name, next) {
    if (modules[name]) return next(null, modules[name])
    if (!name) return next(null, false)

    var pkgFolder = path.resolve(cache, name)
    var packages = {}

    if (!fs.existsSync(pkgFolder)) {
      return next(null, false)
    }

    var versions = fs.readdirSync(
      pkgFolder
    ).filter(function(file) {
      return (
           file.charAt(0) !== '.'
        && file !== 'latest'
      )
    })

    var latest = semver.maxSatisfying(versions, '*')
    var latestPath = path.join(pkgFolder, latest, 'package')
    var latestPackage = path.join(latestPath, 'package.json')

    packages._id = name
    packages.name = name
    packages['dist-tags'] = {
      latest: latest
    }

    readJSON(latestPackage, function(err, pkg) {
      Object.keys(pkg).forEach(function(key) {
        if (packages[key]) return
        packages[key] = pkg[key]
      })

      map(toObject(versions), function(version, i, next) {
        var currentPath = path.join(pkgFolder, version, 'package')
        var currentPackage = path.join(currentPath, 'package.json')
        var currentTarball = path.join(pkgFolder, version, 'package.tgz')

        if (!fs.existsSync(currentPath)) return next()
        if (!fs.existsSync(currentPackage)) return next()
        if (!fs.existsSync(currentTarball)) return next()

        readJSON(currentPackage, function(err, pkg) {
          if (err) return next(err)

          pkg.dependencies = pkg.dependencies || {}
          pkg.devDependencies = pkg.devDependencies || {}
          pkg.peerDependencies = pkg.peerDependencies || {}
          pkg.dist = pkg.dist || {
            tarball: currentTarball
          }

          next(null, pkg)
        })
      }, function(err, versions) {
        if (err) return next(err)

        packages.versions = versions
        modules[name] = packages

        Object.keys(versions).forEach(function(version) {
          if (!versions[version]) delete versions[version]
        })

        next(null, modules[name])
      })
    })
  }
}

function toObject(arr) {
  return arr.reduce(function(obj, key) {
    obj[key] = key
    return obj
  }, {})
}
