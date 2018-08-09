[![Build Status](https://travis-ci.org/alex-hall/node-redis-cache.svg?branch=master)](https://travis-ci.org/alex-hall/node-redis-cache)

### Why? 

This is a zero dependency and _slightly opinionated_ implementation of the Redis package, opinions include: 
    
- Fully Promisified implementation
- Default cache expiry
- Standard cache API
- TODO: Exponential backoff retry logic

This package is also fully tested (Unit + Integration) and is backed by Travis CI for all pull requests.

### Getting Started

In order to install the package, source from either NPM or Yarn: 

```bash
yarn add node-redis-cache
```

### Setup

Simply require the file in your application: 

```javascript
   const RedisCache = require("./RedisCache")

```

From there, specify the default expiry (in seconds) as well as the redis config: 

```javascript
    const redisCache = new RedisCache({
        defaultExpiry: 1,
        redisConfig: "redis://localhost:6379"
        })
    }) 
```

NOTE: the redis config option is simply a passthrough to the [node redis config](https://github.com/NodeRedis/node_redis#rediscreateclient).

### API

The API for this package is intentionally simple and only exposes a few methods: 

**set(key, value, expiry):** Sets a key and value, and an (optional) expiry. If no expiry is set, the default value expiry is used. 

**exists(key):** Returns true/false on whether the key exists in the specified database. 

**get(key):** Returns a value given a key. 

**fetch(key, saveMethod):** Tries to fetch the given key, if the key is not found, calls the save method and tries to persist the return of the save method with the key specified.

_TODO_: add expiry override

**delete(key):** Deletes the given key. 

The API is also designed so that all APIs return a promise by default. This is not default behavior of the Redis package and is an intentional design decision.

### Inspiration

Inspirations for this package include: 

- [ActiveSupport::Cache::Store](https://api.rubyonrails.org/v5.2.0/classes/ActiveSupport/Cache.html)
- [Node cache](https://github.com/mpneuried/nodecache)
- [Node Redis](https://github.com/NodeRedis/node_redis) 