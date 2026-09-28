// Full catalog, statically imported. For build scripts and tests ONLY —
// UI code must use ./loader (per-country chunks) or ./catalog (lightweight index).
import { universities as kw } from "./kw";
import { universities as qa } from "./qa";
import { universities as sa } from "./sa";
import { universities as ae } from "./ae";
import type { University } from "./types";

export const allUniversities: University[] = [...kw, ...qa, ...sa, ...ae];
