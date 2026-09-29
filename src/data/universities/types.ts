// Shared catalog types. Kept free of data so importing them costs nothing.
export interface Course {
  code: string;
  name_en: string;
  name_ar: string;
  credits: number;
  year?: number;
  semester?: number;
  term?: string;
  type?: "Required" | "Elective" | string;
  program_ids?: string[];
  /** Data-quality flag: "missing" = verified code, no official name; "ar_only" = Arabic official name only. */
  name_status?: "missing" | "ar_only";
}

export interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  degree: string;
}

export interface Department {
  id: string;
  name_ar: string;
  name_en: string;
  degrees: string[];
  programs?: Program[];
  courses: Course[];
}

export interface College {
  id: string;
  name_ar: string;
  name_en: string;
  departments: Department[];
}

export interface University {
  id: string;
  name_ar: string;
  name_en: string;
  website: string;
  type: "public" | "private";
  founded: number;
  country_code: string;
  country_ar: string;
  country_en: string;
  logo?: string;
  colleges: College[];
}
