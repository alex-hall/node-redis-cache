const NodeRedisCache = require("./NodeRedisCache")
const redis = require("redis")

jest.mock('redis', () => ({
    createClient: jest.fn(() => {
    })
}))

describe('base functionality', () => {
    it('should not crash', () => {

        const redisConfig = {a: 1};

        expect(new NodeRedisCache(redisConfig)).toBeTruthy()
    })
})
