import { getRedis } from './redis'

/**
 * Rate limit helper using Upstash Redis.
 *
 * Returns true if the request is allowed, false if rate limit exceeded.
 *
 * key - unique identifier (IP, user id, etc)
 * limit - max allowed requests in the window
 * windowSeconds - window length in seconds
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const redis = getRedis()
  if (!redis) {
    // Rate limiting disabled when Redis is not configured
    return true
  }

  const redisKey = `ratelimit:${key}`

  // Atomic set-if-not-exists with TTL; prevents forever-locking if process crashes between INCR and EXPIRE.
  const setResult = await redis.set(redisKey, 1, {
    nx: true,
    ex: windowSeconds,
  })

  if (setResult === 'OK') {
    return true
  }

  // Key already existed, increment it
  const count = await redis.incr(redisKey)
  return count <= limit
}
