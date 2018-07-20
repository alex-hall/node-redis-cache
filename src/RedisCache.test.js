const RedisCache = require("./RedisCache")
const redis = require("redis")

jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        set: jest.fn((a, b, c, d, callback) => callback(null, "OK")),
        exists: jest.fn((a, callback) => callback(null, 0)),
        get: jest.fn((a, callback) => callback(null, "SOME DEFAULT VALUE"))
    }))
}))

describe('base functionality', () => {
    const redisConfig = {a: 1};

    it('should be able to initialize with a config', () => {
        new RedisCache({redisConfig});

        expect(redis.createClient).toBeCalledWith(redisConfig)
    })

    it('should default expiry if none is set', () => {
        const config = new RedisCache({redisConfig});

        expect(config.defaultExpiry).toEqual(1)
    })

    it('should set expiry if set', () => {
        const config = new RedisCache({redisConfig, defaultExpiry: 1000000});

        expect(config.defaultExpiry).toEqual(1000000)
    })

    it('validates expiry is greater than one second', () => {
        try {
            const config = new RedisCache({defaultExpiry: 0});
        } catch (e) {
            expect(e).toEqual("Argument error. Default expiry should be greater than zero.")
        }

    })
})

describe('cache methods', () => {

    let defaultExpiry = 10
    let redisCache

    beforeEach(() => {
        redisCache = new RedisCache();
    })

    describe('set', () => {
        it('should set the appropriate keys in the cache', async () => {
            const cacheResponse = await redisCache.set("SOME_KEY", "SOME VALUE", defaultExpiry)

            expect(cacheResponse).toEqual(true)

            expect(redisCache.client.set).toHaveBeenCalledWith("SOME_KEY", "SOME VALUE", "EX", defaultExpiry, expect.any(Function))
        })
    })

    describe('exists?', () => {
        it('should return true if the key exists', async () => {
            redisCache.client.exists = (jest.fn((a, callback) => callback(null, 1)))

            const existingKey = await redisCache.exists("EXISTING_KEY");
            expect(existingKey).toEqual(true)
        })

        it('should return false if the key does not exist', async () => {
            redisCache.client.exists = (jest.fn((a, callback) => callback(null, 0)))

            const existingKey = await redisCache.exists("NOT_EXISTING_KEY");
            expect(existingKey).toEqual(false)
        })
    })

    describe('get', () => {
        it('should return the value if the key exists', async () => {
            const expectedKeyValue = "THE VALUE OF THE KEY"

            redisCache.client.get = (jest.fn((a, callback) => callback(null, expectedKeyValue)))

            const value = await redisCache.get("EXISTING_KEY");

            expect(value).toEqual(expectedKeyValue)
        })
    })
    describe('fetch', () => {
        it('should return the value if found initially', async () => {
            redisCache.client.get = (jest.fn((a, callback) => callback(null, "PROPER VALUE")))

            const resultFromCallback = await redisCache.fetch("SOME KEY", () => {
                throw "I SHOULDNT GET CALLED"
            })

            expect(resultFromCallback).toEqual("PROPER VALUE")
        })

        it('should invoke the callback method if the key doesnt exist', async () => {
            redisCache.client.get = (jest.fn((a, callback) => callback(null, null)))
            redisCache.client.set = jest.fn((a, b, c, d, callback) => callback(null, "OK"))

            const expectedValue = "THIS SHOULD BE THE RESULT";
            const resultFromCallback = await redisCache.fetch("SOME KEY", () => Promise.resolve(expectedValue))

            expect(resultFromCallback).toEqual(expectedValue)
        })
    })
    describe('clear', () => {
    })
})
