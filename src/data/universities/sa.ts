// SA universities, assembled from per-university modules. Scripts/tests only (via ./all);
// UI code loads single universities through ./loader.
import type { University } from "./types";
import { university as u0 } from "./unis/sa/sa-ksu";

export const universities: University[] = [u0];
