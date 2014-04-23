#!/usr/bin/env node

var npm = require('npmconf')
var http = require('http')
var cache = require('./')

npm.load({}, function(err, config) {
  if (err) throw err

  var cacheDir = config.get('cache')
  var server = http.createServer(
    cache(cacheDir, 'https://registry.npmjs.org/')
  )

  server.listen(12644, function(err) {
    if (err) throw err
    console.log('http://localhost:12644/')
  })
})
