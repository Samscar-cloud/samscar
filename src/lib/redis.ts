import { Redis } from '@upstash/redis'

// Upstash Redis client for serverless rate limiting
// Configure via environment variables:
// UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

let redis: Redis | null = null

export function getRedis() {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL ?? ''
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? ''

  // Skip initialization when not configured or using placeholder values
  if (!url || !token || url.includes('...')) {
    console.warn('Upstash Redis not configured; rate limiting disabled.')
    return null
  }

  try {
    redis = new Redis({ url, token })
  } catch (error) {
    console.warn('Failed to initialize Upstash Redis client; rate limiting disabled.', error)
    redis = null
  }

  return redis
}
