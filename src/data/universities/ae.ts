// AE universities, assembled from per-university modules. Scripts/tests only (via ./all);
// UI code loads single universities through ./loader.
import type { University } from "./types";
import { university as u0 } from "./unis/ae/ae-ku";
import { university as u1 } from "./unis/ae/ae-uaeu";
import { university as u2 } from "./unis/ae/ae-zu";
import { university as u3 } from "./unis/ae/ae-uos";
import { university as u4 } from "./unis/ae/ae-aus";
import { university as u5 } from "./unis/ae/ae-adu";
import { university as u6 } from "./unis/ae/ae-au";
import { university as u7 } from "./unis/ae/ae-aud";
import { university as u8 } from "./unis/ae/ae-ud";
import { university as u9 } from "./unis/ae/ae-aau";
import { university as u10 } from "./unis/ae/ae-hct";

export const universities: University[] = [u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, u10];
