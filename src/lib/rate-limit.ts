// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

// /**
//  * Rate limiting utilities using Upstash Redis
//  */

// // Initialize Redis client
// // We check for env vars to prevent crashes during build time if keys are missing
// const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
//   ? new Redis({
//       url: process.env.UPSTASH_REDIS_REST_URL,
//       token: process.env.UPSTASH_REDIS_REST_TOKEN,
//     })
//   : null;

// /**
//  * 1. Login rate limiter (Critical Security)
//  * Prevents brute-force attacks on the admin panel.
//  * Limit: 5 attempts per 15 minutes per IP.
//  */
// export const loginRateLimiter = redis
//   ? new Ratelimit({
//       redis,
//       limiter: Ratelimit.slidingWindow(5, '15 m'),
//       analytics: true,
//       prefix: 'ratelimit:login',
//     })
//   : null;

// /**
//  * 2. Admin API rate limiter
//  * Protects dashboard actions (Creating/Editing posts).
//  * Limit: 100 requests per minute.
//  */
// export const adminApiRateLimiter = redis
//   ? new Ratelimit({
//       redis,
//       limiter: Ratelimit.slidingWindow(100, '1 m'),
//       analytics: true,
//       prefix: 'ratelimit:admin-api',
//     })
//   : null;

// /**
//  * 3. File upload rate limiter
//  * Prevents S3 storage spam/abuse.
//  * Limit: 10 uploads per hour per user/IP.
//  */
// export const uploadRateLimiter = redis
//   ? new Ratelimit({
//       redis,
//       limiter: Ratelimit.slidingWindow(10, '1 h'),
//       analytics: true,
//       prefix: 'ratelimit:upload',
//     })
//   : null;

// /**
//  * 4. General API rate limiter (Public routes)
//  * Protects public endpoints (like Post Views, Likes, Fetching posts) from DDoS.
//  * Limit: 60 requests per minute per IP.
//  */
// export const generalApiRateLimiter = redis
//   ? new Ratelimit({
//       redis,
//       limiter: Ratelimit.slidingWindow(60, '1 m'),
//       analytics: true,
//       prefix: 'ratelimit:general',
//     })
//   : null;

// /**
//  * Helper: Get IP address from request
//  * Handles Cloudflare, Vercel, and standard headers.
//  */
// export function getIP(request: Request): string {
//   const forwardedFor = request.headers.get('x-forwarded-for');
//   const realIP = request.headers.get('x-real-ip');
//   const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

//   if (cfConnectingIP) return cfConnectingIP;
//   if (realIP) return realIP;
//   if (forwardedFor) return forwardedFor.split(',')[0].trim();

//   return 'unknown';
// }

// /**
//  * Helper: Check rate limit
//  * Returns success: true if Redis is down (Fail Open strategy) to prevent blocking users.
//  */
// export async function checkRateLimit(
//   rateLimiter: Ratelimit | null,
//   identifier: string
// ): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
//   // If Redis is not configured, allow the request but log warning
//   if (!rateLimiter) {
//     console.warn('Rate limiter not configured - Redis credentials missing');
//     return { success: true };
//   }

//   try {
//     const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);

//     return {
//       success,
//       limit,
//       remaining,
//       reset,
//     };
//   } catch (error) {
//     console.error('Rate limit check failed:', error);
//     // On error, allow the request so real users aren't blocked by a Redis outage
//     return { success: true };
//   }
// }

// /**
//  * Helper: Format Headers for Response
//  */
// export function getRateLimitHeaders(result: {
//   limit?: number;
//   remaining?: number;
//   reset?: number;
// }): Record<string, string> {
//   const headers: Record<string, string> = {};

//   if (result.limit !== undefined) {
//     headers['X-RateLimit-Limit'] = result.limit.toString();
//   }
//   if (result.remaining !== undefined) {
//     headers['X-RateLimit-Remaining'] = result.remaining.toString();
//   }
//   if (result.reset !== undefined) {
//     headers['X-RateLimit-Reset'] = new Date(result.reset).toISOString();
//   }

//   return headers;
// }