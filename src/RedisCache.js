const redis = require("redis")
const {promisify} = require("util")

module.exports = class RedisCache {

    constructor({defaultExpiry = 1, redisConfig = {}} = {}) {
        this.client = new redis.createClient(redisConfig)

        if (defaultExpiry <= 0) {
            throw "Argument error. Default expiry should be greater than zero."
        }

        this.client.on('error', (error) => console.log(`Error: ${error.code}`))

        this.defaultExpiry = defaultExpiry
    }

    set(key, value, expiry = this.defaultExpiry) {
        const asyncSet = this.promisifyMethod(this.client, "set")

        return asyncSet(key, value, "EX", expiry).then(response => response === "OK");
    }

    exists(key) {
        const asyncExists = this.promisifyMethod(this.client, "exists")

        return asyncExists(key).then(response => response === 1)
    }

    get(key) {
        const asyncGet = this.promisifyMethod(this.client, "get")

        return asyncGet(key)
    }

    async fetch(key, saveMethod) {
        const valueFound = await this.get(key)

        if (valueFound) {
            return valueFound
        } else {
            const valueToBeSaved = await Promise.resolve(saveMethod())

            await this.set(key, valueToBeSaved, this.defaultExpiry)

            return valueToBeSaved
        }
    }

    delete(key) {
        const asyncDelete = this.promisifyMethod(this.client, "del")

        return asyncDelete(key).then(response => response === 1)

    }

    promisifyMethod(client, method) {
        return promisify(client[method]).bind(client)
    }
}

