/** @param {string} segment Base64url segment (no dots). */
const decodeJsonSegment = (segment) => {
  try {
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch (_err) {
    return null;
  }
};

/** Decode JWT header (first segment). No signature verification. */
export const decodeJwtHeader = (access) => {
  const parts = String(access).split('.');
  return decodeJsonSegment(parts[0]);
};

/** Decode JWT payload (second segment). No signature verification. */
export const decodeJwtPayload = (access) => {
  const parts = String(access).split('.');
  if (parts.length < 2) return null;
  return decodeJsonSegment(parts[1]);
};

/**
 * True if the token is not a normal 3-part JWT or header/payload do not decode.
 * Catches corrupted header/signature segments; a payload-only decode would miss header corruption.
 * A structurally valid token with a wrong signature still passes here; the server / WebSocket
 * handshake flow must refresh or fail in that case.
 */
export const isAccessTokenIllFormed = (access) => {
  const parts = String(access).split('.').filter(Boolean);
  if (parts.length !== 3) return true;
  const header = decodeJwtHeader(access);
  const payload = decodeJwtPayload(access);
  if (!header || typeof header.alg !== 'string' || !header.alg) return true;
  if (!payload || !Number.isFinite(Number(payload.exp))) return true;
  return false;
};

/** True if access is expired or expires within skewSeconds (default 2 minutes). */
export const isAccessTokenExpiredOrExpiringSoon = (access, skewSeconds = 120) => {
  const payload = decodeJwtPayload(access);
  const exp = Number(payload?.exp);
  if (!exp) return false;
  const deadlineMs = exp * 1000 - skewSeconds * 1000;
  return Date.now() >= deadlineMs;
};
