const RedisCache = require("./RedisCache")

let redisCache

describe('Integration', () => {
    const desiredExpiryInSeconds = 1

    beforeEach(() => {
        redisCache = new RedisCache({
            defaultExpiry: 1,
            redisConfig: "redis://cache:6379"
        })
    })

    describe('basic CRUD operation', () => {
        it('gets, sets, exists, and expires!', async () => {

            const initialKey = await redisCache.get("SOME_KEY")

            expect(initialKey).toEqual(null)

            const wasKeyWritten = await redisCache.set("SOME_KEY", "SOME VALUE", desiredExpiryInSeconds)

            expect(wasKeyWritten).toEqual(true)

            const doesKeyExist = await redisCache.exists("SOME_KEY")

            expect(doesKeyExist).toEqual(true)

            await new Promise((resolve) => setTimeout(resolve, (desiredExpiryInSeconds * 1000) + 1));

            const doesKeyExistAfterExpiry = await redisCache.exists("SOME_KEY")

            expect(doesKeyExistAfterExpiry).toEqual(false)
        })
    })

    describe('fetches a key if it does not exist', () => {
        it('should not exist, then get fetched, then exist', async () => {
            const keyShouldntExist = await redisCache.exists("FETCHED_KEY")

            expect(keyShouldntExist).toEqual(false)

            const expectedValue = "DATA I WANT";

            const valueShouldReturn = await redisCache.fetch("FETCHED_KEY", () => Promise.resolve(expectedValue))

            expect(valueShouldReturn).toEqual(expectedValue)

            const getFromCache = await redisCache.get("FETCHED_KEY")

            expect(getFromCache).toEqual(expectedValue)
        })
    })

    describe('removing data', () => {
        it('should remove already existing keys', async () => {
            const keyWritten = await redisCache.set("SOME_KEY", "SOME VALUE", 1000)

            expect(keyWritten).toBe(true)

            const keyFromCache = await redisCache.get("SOME_KEY")

            expect(keyFromCache).toEqual("SOME VALUE")

            const wasKeyDeleted = await redisCache.delete("SOME_KEY")

            expect(wasKeyDeleted).toEqual(true)

            const deletedKey = await redisCache.get("SOME_KEY")

            expect(deletedKey).toEqual(null)

        })
    })
})