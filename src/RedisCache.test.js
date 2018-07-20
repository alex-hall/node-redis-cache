const RedisCache = require("./RedisCache")
const redis = require("redis")

jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        set: jest.fn((a, b, c, d, callback) => callback(null, true))
    }))
}))

describe('base functionality', () => {
    it('should be able to initialize with a config', () => {
        const redisConfig = {a: 1};

        const redisCache = new RedisCache(redisConfig);

        expect(redis.createClient).toBeCalledWith(redisConfig)
    })
})

describe('cache methods', () => {

    let defaultExpiry = 10

    describe('set', () => {
        it('should set the appropriate keys in the cache', async () => {
            const redisCache = new RedisCache({expiry: defaultExpiry});

            const cacheResponse = await redisCache.set("SOME_KEY", "SOME VALUE", defaultExpiry)

            expect(cacheResponse).toEqual(true)
            expect(redisCache.client.set).toHaveBeenCalledWith("SOME_KEY", "SOME VALUE", "EX", defaultExpiry, expect.any(Function))
        })
    })

    describe('get', () => {
    })
    describe('fetch', () => {
    })
    describe('clear', () => {
    })
    describe('exists?', () => {
    })
})
