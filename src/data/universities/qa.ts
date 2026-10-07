// QA universities, assembled from per-university modules. Scripts/tests only (via ./all);
// UI code loads single universities through ./loader.
import type { University } from "./types";
import { university as u0 } from "./unis/qa/qa-qu";
import { university as u1 } from "./unis/qa/qa-udst";
import { university as u2 } from "./unis/qa/qa-hbku";
import { university as u3 } from "./unis/qa/qa-lu";
import { university as u4 } from "./unis/qa/qa-ccq";
import { university as u5 } from "./unis/qa/qa-cmuq";
import { university as u6 } from "./unis/qa/qa-guq";
import { university as u7 } from "./unis/qa/qa-nuq";
import { university as u8 } from "./unis/qa/qa-vcuq";
import { university as u9 } from "./unis/qa/qa-wcmq";
import { university as u10 } from "./unis/qa/qa-tamuq";

export const universities: University[] = [u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, u10];
