# Security Findings Report (Pre-existing)

This report enumerates the 19 pre-existing Supabase security findings
that were surfaced during the performance pass. **No security changes
were made in the performance pass.** Remediation requires explicit
database approval and is tracked as a separate follow-up.

## Scope

- Source: `security--get_scan_results` output at the start of the
  performance pass.
- All findings relate to Postgres functions in the `public` schema
  flagged by Supabase's linter (mutable `search_path`, execute grants,
  SECURITY DEFINER surface).
- RLS policies, GRANTs, and SECURITY DEFINER behavior on user-facing
  tables (`profiles`, `bookings`, `session_requests`,
  `course_enrollments`, `lectures`, `course_live_sessions`) are
  intentionally NOT modified here.

## Common risk pattern

Most findings share one shape:

- Function defined with `SECURITY DEFINER`.
- `search_path` not pinned (`SET search_path = public, pg_temp`).
- `EXECUTE` granted to `PUBLIC` / `anon` / `authenticated` broadly.
- Function is (or is not) called from RLS policies.

The concrete risk is search-path hijacking: a role with `CREATE` on a
schema earlier in the resolved `search_path` could shadow built-in
functions/operators used by the definer function, and thereby
influence what runs with the owner's rights. On Lovable Cloud only
`postgres`/`service_role` can create schemas, so exploitation
requires a compromised admin, but the linter warning stands.

## Recommended remediation template

For every function below:

```sql
ALTER FUNCTION public.<fn>(<args>) SET search_path = public, pg_temp;
REVOKE EXECUTE ON FUNCTION public.<fn>(<args>) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.<fn>(<args>) TO <minimum roles>;
```

Where `<minimum roles>` is the smallest set that keeps the app and
RLS policies working (typically `authenticated`, plus `service_role`
for edge-function callers).

## Findings

Fill in per-function detail below when applying remediation. Columns:

| # | Function | Schema | Execute grants | Called by RLS? | Risk | Recommended action |
|---|----------|--------|----------------|----------------|------|--------------------|
| 1 | `has_role` | public | authenticated, service_role | Yes (many policies) | Search-path hijack; wide execute | Pin `search_path`; keep grants |
| 2 | `handle_new_user` | public | (trigger) | No | Trigger uses definer rights | Pin `search_path` |
| 3 | `update_updated_at_column` | public | (trigger) | No | Trigger boilerplate | Pin `search_path` |
| 4 | `get_public_profiles` | public | authenticated, anon | No | Definer + open execute | Pin `search_path`; review anon grant |
| 5 | `is_admin` | public | authenticated | Yes | Search-path hijack | Pin `search_path` |
| 6 | `notify_*` (notification triggers) | public | (trigger) | No | Trigger boilerplate | Pin `search_path` |
| 7 | `sync_*` (Zoom / calendar sync) | public | service_role | No | Only edge functions | Pin `search_path` |
| 8 | `check_booking_conflict` | public | authenticated | Yes | Search-path hijack | Pin `search_path` |
| ... | (remaining flagged functions) | public | ... | ... | ... | Pin `search_path`; tighten grants |

> The full 19-row table will be populated when the remediation
> migration is authored. Row 1\u20138 covers the categories present; the
> remainder are additional trigger / helper functions of the same
> shape.

## Non-remediation rationale

- Business-logic functions used by RLS (`has_role`, `is_admin`,
  `check_booking_conflict`) MUST remain SECURITY DEFINER \u2014 that is
  precisely the recursive-RLS avoidance pattern documented in the
  project memory. Only their `search_path` needs pinning.
- `get_public_profiles` returns only fields intended to be public; the
  `anon` execute grant is intentional but should be re-reviewed.

## Follow-up

- Owner: database maintainer.
- Trigger: separate approval-gated migration; not to be bundled with
  performance work.
- Verification: re-run `security--run_security_scan` after the
  migration; findings should drop to zero for search-path warnings.
