// Admin MFA enforcement for edge functions.
// Call only AFTER the token was verified (auth.getUser / getClaims); this just
// reads the verified token's assurance level.
export function hasAal2(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const part = token.split(".")[1];
  if (!part) return false;
  try {
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json)?.aal === "aal2";
  } catch {
    return false;
  }
}

export const MFA_REQUIRED_MESSAGE =
  "Two-step verification is required for admin actions.";
