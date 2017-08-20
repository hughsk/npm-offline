# npm-offline [![deprecated](http://hughsk.github.io/stability-badges/dist/deprecated.svg)](http://github.com/hughsk/stability-badges) #

[![npm-offline](https://nodei.co/npm/npm-offline.png?mini=true)](https://nodei.co/npm/npm-offline)

**Deprecated. Use `npm install --cache-min Ininity` instead! :)**

An npm registry proxy that uses your npm cache to retrieve modules, allowing for offline access to any modules you've previously installed pretty much ever.

Super useful when you're moving around a lot and don't always have internet
readily available – i.e. when travelling, or at events such as
[CampJS](http://campjs.com/). It's nice to not need a decent WiFi connection to
start a new project.

## CLI Usage ##

Install globally using the following:

``` bash
$ npm install -g npm-offline
```

Then you can boot up the proxy server using your newly installed `npm-offline`
command:

```
$ npm-offline
http://localhost:12644/
```

### Switching Registries ###

The final step is to point npm to use this registry instead of the default
`registry.npmjs.org`. You don't want to do this permanently, or you'll never
get up-to-date module versions. But by using [npmrc](http://ghub.io/npmrc)
you can quickly switch between registries. If you're not familiar with it,
you can get a basic setup like so:

```
npm install -g npmrc
mkdir -p ~/.npmrcs
cat ~/.npmrc > ~/.npmrcs/default
cat ~/.npmrc > ~/.npmrcs/local
npmrc local
npm config set registry http://localhost:12644/
```

You can now switch between the local registry and the remote one using a single
command:

```
npmrc local   # use local modules
npmrc default # use the US registry
```

This is the same approach advised when using the Australian/European
npm mirrors and internal private registries, so it's worth familiarising
yourself with it :)

## Module Usage ##

If, for whatever reason, you want to include npm-offline as part of a larger
web server you can easily do so.

### route = offline(cache, registry) ###

Creates a route for proxying requests: where `cache` is your npm cache
repository.

### route(req, res) ###

``` javascript
var offline = require('npm-offline')
var express = require('express')
var npmconf = require('npmconf')

var app = express()

npmconf.load({}, function(err, config) {
  if (err) throw err

  app.use(offline(
      config.cache
    , 'http://registry.npmjs.org/'
  ))

  app.listen(12411, function(err) {
    if (err) throw err
  })
})
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/npm-offline/blob/master/LICENSE.md) for details.
