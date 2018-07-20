const redis = require("redis")
const {promisify} = require("util")

module.exports = class RedisCache {

    constructor(clientConfig) {
        this.client = new redis.createClient(clientConfig)

        this.defaultExpiry = clientConfig.defaultExpiry
    }

    set(key, value, expiry) {
        const asyncSet = promisify(this.client.set).bind(this.client)

        return asyncSet(key, value, "EX", expiry)
    }


}

