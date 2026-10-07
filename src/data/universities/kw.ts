// KW universities, assembled from per-university modules. Scripts/tests only (via ./all);
// UI code loads single universities through ./loader.
import type { University } from "./types";
import { university as u0 } from "./unis/kw/kw-ku";
import { university as u1 } from "./unis/kw/kw-auk";
import { university as u2 } from "./unis/kw/kw-au";
import { university as u3 } from "./unis/kw/kw-aou";
import { university as u4 } from "./unis/kw/kw-aum";
import { university as u5 } from "./unis/kw/kw-gust";

export const universities: University[] = [u0, u1, u2, u3, u4, u5];
