// On-demand loading of university data. Each university is its own chunk,
// so a page downloads only the universities it renders.
import { useEffect, useState } from "react";
import type { University } from "./types";
import { UNIVERSITY_INDEX } from "./universityIndex.generated";

type Mod = { university: University };
const modules = import.meta.glob<Mod>("./unis/*/*.ts");
const importerFor = (id: string) => {
  const cc = id.split("-")[0]!.toLowerCase();
  return modules[`./unis/${cc}/${id.toLowerCase()}.ts`];
};

// Order matters: it is the catalog's canonical order (KW, QA, SA, AE).
export const COUNTRY_MODULE_CODES = ["KW", "QA", "SA", "AE"];

const pending = new Map<string, Promise<University>>();
const loaded = new Map<string, University>();

export function loadUniversity(id: string): Promise<University | undefined> {
  const importer = importerFor(id);
  if (!importer) return Promise.resolve(undefined);
  let p = pending.get(id);
  if (!p) {
    p = importer().then((m) => {
      loaded.set(id, m.university);
      return m.university;
    });
    p.catch(() => pending.delete(id)); // allow retry after a failed download
    pending.set(id, p);
  }
  return p;
}

/** Sorts ids into the catalog order (country order, then index order). */
const sortIds = (ids: string[]) =>
  UNIVERSITY_INDEX.filter((u) => ids.includes(u.id))
    .sort(
      (a, b) =>
        COUNTRY_MODULE_CODES.indexOf(a.country_code) -
        COUNTRY_MODULE_CODES.indexOf(b.country_code),
    )
    .map((u) => u.id);

export const loadUniversities = (ids: string[]) =>
  Promise.all(sortIds(ids).map(loadUniversity)).then((l) =>
    l.filter((u): u is University => !!u),
  );

export const countryUniversityIds = (codes: string[]) =>
  UNIVERSITY_INDEX.filter((u) => codes.includes(u.country_code)).map(
    (u) => u.id,
  );

export const loadCountry = (code: string) =>
  loadUniversities(countryUniversityIds([code]));
export const loadCountries = (codes: string[]) =>
  loadUniversities(countryUniversityIds(codes));
export const loadAllUniversities = () => loadCountries(COUNTRY_MODULE_CODES);

const getLoaded = (ids: string[]) =>
  ids.every((id) => loaded.has(id)) ? ids.map((id) => loaded.get(id)!) : null;

/** Loads the given universities. `data` is null while downloading. */
export function useUniversities(ids: string[]) {
  const sorted = sortIds(ids);
  const key = sorted.join(",");
  const [state, setState] = useState<{
    key: string;
    data: University[] | null;
    error: boolean;
  }>(() => ({ key, data: getLoaded(sorted), error: false }));

  useEffect(() => {
    const list = key ? key.split(",") : [];
    const ready = getLoaded(list);
    if (ready) {
      setState({ key, data: ready, error: false });
      return;
    }
    let cancelled = false;
    setState({ key, data: null, error: false });
    loadUniversities(list)
      .then((data) => !cancelled && setState({ key, data, error: false }))
      .catch(() => !cancelled && setState({ key, data: null, error: true }));
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Never hand back stale data from a previous key during the first render after a change.
  if (state.key !== key) return { data: getLoaded(sorted), error: false };
  return { data: state.data, error: state.error };
}

/** Loads every university in the given countries. */
export const useCountryUniversities = (codes: string[]) =>
  useUniversities(countryUniversityIds(codes));
