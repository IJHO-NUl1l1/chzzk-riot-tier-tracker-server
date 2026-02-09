/**
 * Global proxy (Next.js 16)
 */
import { NextResponse } from 'next/server';

// IP-based rate limiting
const ipRequestCounts = new Map();
const ipLastReset = new Map();

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 60 // 60 requests per minute
};

export function proxy(request) {
  // Add CORS headers
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers
    });
  }
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const windowStart = ipLastReset.get(ip) || 0;
    
    // Reset counter if window has passed
    if (now - windowStart > RATE_LIMIT.windowMs) {
      ipRequestCounts.set(ip, 0);
      ipLastReset.set(ip, now);
    }
    
    // Increment request count
    const requestCount = (ipRequestCounts.get(ip) || 0) + 1;
    ipRequestCounts.set(ip, requestCount);
    
    // Return 429 if rate limit exceeded
    if (requestCount > RATE_LIMIT.max) {
      return new NextResponse(JSON.stringify({
        error: 'Too many requests, please try again later'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          ...response.headers
        }
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*'
};