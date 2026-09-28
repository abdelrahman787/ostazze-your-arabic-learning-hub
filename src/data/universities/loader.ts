// On-demand loading of per-country university data. Each country is its own chunk,
// so visiting one country never downloads the others.
import { useEffect, useState } from "react";
import type { University } from "./types";

type Mod = { universities: University[] };

// Order matters: it is the catalog's canonical order (KW, QA, SA, AE).
const importers: Record<string, () => Promise<Mod>> = {
  KW: () => import("./kw"),
  QA: () => import("./qa"),
  SA: () => import("./sa"),
  AE: () => import("./ae"),
};

export const COUNTRY_MODULE_CODES = Object.keys(importers);

const pending = new Map<string, Promise<University[]>>();
const loaded = new Map<string, University[]>();

export function loadCountry(code: string): Promise<University[]> {
  const importer = importers[code];
  if (!importer) return Promise.resolve([]);
  let p = pending.get(code);
  if (!p) {
    p = importer().then((m) => {
      loaded.set(code, m.universities);
      return m.universities;
    });
    p.catch(() => pending.delete(code)); // allow retry after a failed download
    pending.set(code, p);
  }
  return p;
}

const sortCodes = (codes: string[]) => COUNTRY_MODULE_CODES.filter((c) => codes.includes(c));

export const loadCountries = (codes: string[]) =>
  Promise.all(sortCodes(codes).map(loadCountry)).then((lists) => lists.flat());

export const loadAllUniversities = () => loadCountries(COUNTRY_MODULE_CODES);

const getLoaded = (codes: string[]) => {
  const sorted = sortCodes(codes);
  if (!sorted.every((c) => loaded.has(c))) return null;
  return sorted.flatMap((c) => loaded.get(c)!);
};

/** Loads the given countries' universities. `data` is null while downloading. */
export function useCountryUniversities(codes: string[]) {
  const key = sortCodes(codes).join(",");
  const [state, setState] = useState<{ key: string; data: University[] | null; error: boolean }>(() => ({
    key,
    data: getLoaded(codes),
    error: false,
  }));

  useEffect(() => {
    const ready = getLoaded(key ? key.split(",") : []);
    if (ready) {
      setState({ key, data: ready, error: false });
      return;
    }
    let cancelled = false;
    setState({ key, data: null, error: false });
    loadCountries(key ? key.split(",") : [])
      .then((data) => !cancelled && setState({ key, data, error: false }))
      .catch(() => !cancelled && setState({ key, data: null, error: true }));
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Never hand back stale data from a previous key during the first render after a change.
  if (state.key !== key) return { data: getLoaded(codes), error: false };
  return { data: state.data, error: state.error };
}
