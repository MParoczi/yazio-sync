/**
 * YAZIO Proxy Health Check API Route
 *
 * GET /api/yazio/health
 * Simple health check endpoint to verify API routes are operational
 */

import { NextResponse } from 'next/server';

/**
 * GET /api/yazio/health
 *
 * Health check endpoint
 *
 * Response:
 * {
 *   "status": "ok",
 *   "timestamp": "2025-01-07T12:00:00.000Z",
 *   "service": "yazio-proxy"
 * }
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'yazio-proxy',
  });
}
