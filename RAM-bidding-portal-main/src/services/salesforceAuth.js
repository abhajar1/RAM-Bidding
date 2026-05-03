const OAUTH_SESSION_KEY = 'sf.oauth.session'
const OAUTH_STATE_KEY = 'sf.oauth.state'
const OAUTH_PKCE_VERIFIER_KEY = 'sf.oauth.pkce_verifier'

const DEFAULT_LOGIN_URL = 'https://login.salesforce.com'
const DEFAULT_SCOPE = 'openid api web'
const DEFAULT_RESPONSE_TYPE = 'code'

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '')
}

function getOAuthRedirectUri() {
  return `${window.location.origin}/oauth/callback`
}

function generateRandomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const randomValues = new Uint8Array(length)
  window.crypto.getRandomValues(randomValues)

  let output = ''
  for (let i = 0; i < length; i += 1) {
    output += charset[randomValues[i] % charset.length]
  }
  return output
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

function parseHashParams(hash) {
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash
  return new URLSearchParams(cleaned)
}

function getConfig() {
  const clientId = import.meta.env.VITE_SF_CLIENT_ID || ''
  const loginUrl = trimTrailingSlash(import.meta.env.VITE_SF_LOGIN_URL || DEFAULT_LOGIN_URL)
  const scope = import.meta.env.VITE_SF_OAUTH_SCOPE || DEFAULT_SCOPE
  const responseType = import.meta.env.VITE_SF_OAUTH_RESPONSE_TYPE || DEFAULT_RESPONSE_TYPE

  return {
    clientId,
    loginUrl,
    scope,
    responseType,
    redirectUri: getOAuthRedirectUri(),
  }
}

export function isSalesforceConfigured() {
  const config = getConfig()
  return Boolean(config.clientId && config.loginUrl)
}

export function getSalesforceSession() {
  const raw = sessionStorage.getItem(OAUTH_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(OAUTH_SESSION_KEY)
    return null
  }
}

export function getSalesforceAccessToken() {
  return getSalesforceSession()?.accessToken || ''
}

export function clearSalesforceSession() {
  sessionStorage.removeItem(OAUTH_SESSION_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_PKCE_VERIFIER_KEY)
}

function saveSalesforceSession({
  accessToken,
  instanceUrl,
  issuedAt,
  signature,
  tokenType,
  scope,
  id,
}) {
  const payload = {
    accessToken,
    instanceUrl,
    issuedAt,
    signature,
    tokenType,
    scope,
    id,
    savedAt: new Date().toISOString(),
  }
  sessionStorage.setItem(OAUTH_SESSION_KEY, JSON.stringify(payload))
}

async function exchangeCodeForToken(code, verifier, config) {
  const form = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code_verifier: verifier,
  })

  let response
  try {
    response = await fetch(`${config.loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
  } catch (error) {
    throw new Error(
      'Token endpoint unreachable (CORS/network). Check Salesforce CORS allowlist, OAuth endpoint CORS settings, and Web Server Flow secret policy.'
    )
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Token exchange failed (${response.status}): ${message}`)
  }

  return response.json()
}

export async function startSalesforceLogin() {
  const config = getConfig()

  if (!isSalesforceConfigured()) {
    throw new Error('Salesforce OAuth is not configured. Missing VITE_SF_CLIENT_ID.')
  }

  const state = generateRandomString(48)
  sessionStorage.setItem(OAUTH_STATE_KEY, state)

  const params = new URLSearchParams({
    response_type: config.responseType,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state,
  })

  if (config.responseType === 'code') {
    const verifier = generateRandomString(96)
    const challenge = await generateCodeChallenge(verifier)
    sessionStorage.setItem(OAUTH_PKCE_VERIFIER_KEY, verifier)
    params.set('code_challenge', challenge)
    params.set('code_challenge_method', 'S256')
  }

  const authUrl = `${config.loginUrl}/services/oauth2/authorize?${params.toString()}`
  window.location.assign(authUrl)
}

export async function handleSalesforceCallback(currentUrl = window.location.href) {
  const config = getConfig()
  const url = new URL(currentUrl)
  const query = url.searchParams
  const hash = parseHashParams(url.hash)

  const responseState = query.get('state') || hash.get('state')
  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)

  if (!expectedState || responseState !== expectedState) {
    throw new Error('Invalid OAuth state. Please retry login.')
  }

  const oauthError = query.get('error') || hash.get('error')
  if (oauthError) {
    const description = query.get('error_description') || hash.get('error_description') || 'Unknown OAuth error'
    throw new Error(`${oauthError}: ${description}`)
  }

  const accessTokenFromHash = hash.get('access_token')
  if (accessTokenFromHash) {
    saveSalesforceSession({
      accessToken: accessTokenFromHash,
      instanceUrl: hash.get('instance_url') || import.meta.env.VITE_SF_INSTANCE_URL || '',
      issuedAt: hash.get('issued_at'),
      signature: hash.get('signature'),
      tokenType: hash.get('token_type') || 'Bearer',
      scope: hash.get('scope') || config.scope,
      id: hash.get('id'),
    })
    return
  }

  const code = query.get('code')
  if (!code) {
    throw new Error('No access_token or code received from Salesforce.')
  }

  const verifier = sessionStorage.getItem(OAUTH_PKCE_VERIFIER_KEY)
  sessionStorage.removeItem(OAUTH_PKCE_VERIFIER_KEY)
  if (!verifier) {
    throw new Error('Missing PKCE verifier. Retry the OAuth login.')
  }

  const tokenPayload = await exchangeCodeForToken(code, verifier, config)
  saveSalesforceSession({
    accessToken: tokenPayload.access_token,
    instanceUrl: tokenPayload.instance_url || import.meta.env.VITE_SF_INSTANCE_URL || '',
    issuedAt: tokenPayload.issued_at,
    signature: tokenPayload.signature,
    tokenType: tokenPayload.token_type || 'Bearer',
    scope: tokenPayload.scope || config.scope,
    id: tokenPayload.id,
  })
}
