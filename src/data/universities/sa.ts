// SA universities, assembled from per-university modules. Scripts/tests only (via ./all);
// UI code loads single universities through ./loader.
import type { University } from "./types";
import { university as u0 } from "./unis/sa/sa-ksu";
import { university as u1 } from "./unis/sa/sa-uqu";
import { university as u2 } from "./unis/sa/sa-alfaisal";
import { university as u3 } from "./unis/sa/sa-psu";
import { university as u4 } from "./unis/sa/sa-kfupm";
import { university as u5 } from "./unis/sa/sa-kau";
import { university as u6 } from "./unis/sa/sa-kku";
import { university as u7 } from "./unis/sa/sa-pnu";
import { university as u8 } from "./unis/sa/sa-taibah";
import { university as u9 } from "./unis/sa/sa-effat";
import { university as u10 } from "./unis/sa/sa-dah";
import { university as u11 } from "./unis/sa/sa-pmu";
import { university as u12 } from "./unis/sa/sa-qu";
import { university as u13 } from "./unis/sa/sa-ju";

export const universities: University[] = [u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11, u12, u13];
