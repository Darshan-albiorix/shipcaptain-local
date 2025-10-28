import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SECRET = process.env.JWT_SECRET!

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Decode payload to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]))

    // Check expiration (if 'exp' claim exists)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('JWT expired')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify signature
    const isValid = await verifyJWT(token, SECRET)
    if (!isValid) {
      console.log('Invalid JWT signature')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ✅ Token valid — allow access
    return NextResponse.next()
  } catch (error) {
    console.error('JWT verification failed:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/roles/:path*'],
}

async function verifyJWT(token: string, secret: string) {
  const [headerB64, payloadB64, signatureB64] = token.split('.')
  if (!headerB64 || !payloadB64 || !signatureB64) return false

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const data = encoder.encode(`${headerB64}.${payloadB64}`)
  const signature = base64UrlToUint8Array(signatureB64)
  const isValid = await crypto.subtle.verify('HMAC', key, signature, data)
  return isValid
}

function base64UrlToUint8Array(base64Url: string) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4 ? 4 - (base64.length % 4) : 0
  const padded = base64 + '='.repeat(pad)
  const raw = atob(padded)
  const array = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) array[i] = raw.charCodeAt(i)
  return array
}