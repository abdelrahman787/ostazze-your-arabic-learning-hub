# Repair password recovery

## Goal
Implement and verify a complete, safe PKCE password-recovery flow for preview and production without publishing.

## Changes
- Replace the direct reset-page redirect with an environment-aware `/auth/callback?next=/reset-password` URL: the exact active preview origin in preview and `https://ostaze.com` in production.
- Add a public callback page that validates `next`, exchanges the one-time PKCE code for a session, persists it through the existing auth storage, and handles missing, invalid, expired, or reused codes without exposing secrets.
- Make the forgot-password response generic while surfacing safe delivery failures, and block duplicate submissions while a request is active.
- Make the reset page wait for authenticated recovery state, refuse direct/expired access, validate both password fields, update the password, sign out the recovery session, and return to normal sign-in. Admin MFA remains unchanged and mandatory.
- Configure the authentication Site URL and exact production/preview redirect allowlist if the available backend controls support these fields; otherwise report the precise remaining console-only setting rather than pretending it was changed.
- Add route metadata and focused automated tests for callback path validation and invalid/expired recovery states.

## Verification
- Request exactly one fresh recovery email and test it in the same browser profile when mailbox access is available.
- Verify valid reset, old-password rejection, one-time link reuse rejection, expired/direct-link refusal, external redirect refusal, session end, and continued admin MFA enforcement.
- Run production build, typecheck, tests, lint, security scan, route-size budget, production start/health check, and sitemap audit.
- Do not publish.

## Safety
- Never log or display codes, tokens, passwords, MFA secrets, OTPs, or recovery data.
- Never allow an external `next` destination or a production wildcard redirect.
- Send no more than one recovery email during verification.
