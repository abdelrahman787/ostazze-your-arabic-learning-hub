// Centralized JSON-LD builders for Ostaze SEO.
// Keep schemas conservative — only emit valid, accurate data.

export const SITE_URL = "https://ostaze.com";
export const SITE_NAME = "OSTAZE";

export const organizationJsonLd = (lang: "ar" | "en" = "ar") => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: lang === "ar" ? "أُسطازي" : "Ostaze",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description:
    lang === "ar"
      ? "منصة كورسات تعليمية رقمية تقدم كورسات مسجلة وحية في مختلف التخصصات الأكاديمية والمهنية"
      : "A digital online learning platform offering recorded and live courses across academic and professional subjects",
  email: "info@ostaze.com",
  telephone: "+966559003498",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
    addressLocality: "Riyadh",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+966559003498",
    contactType: "customer support",
    email: "info@ostaze.com",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [SITE_URL],
});

export const websiteJsonLd = (lang: "ar" | "en" = "ar") => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: lang === "ar" ? "ar-SA" : "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/teachers?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const itemListJsonLd = (
  name: string,
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    url: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
  })),
});

export const courseJsonLd = (course: {
  id: string;
  title: string;
  description?: string | null;
  instructor?: string | null;
  price?: number;
  image?: string | null;
  lang?: "ar" | "en";
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.description || course.title,
  provider: { "@id": `${SITE_URL}/#organization` },
  inLanguage: course.lang === "en" ? "en" : "ar",
  url: `${SITE_URL}/courses/${course.id}`,
  ...(course.image ? { image: course.image } : {}),
  ...(course.instructor
    ? { author: { "@type": "Person", name: course.instructor } }
    : {}),
  ...(typeof course.price === "number"
    ? {
        offers: {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "SAR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/courses/${course.id}`,
          category: "OnlineCourse",
        },
      }
    : {}),
});

export const personJsonLd = (p: {
  id: string;
  name: string;
  jobTitle?: string;
  university?: string | null;
  subjects?: string[];
  image?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/teachers/${p.id}#person`,
  name: p.name,
  jobTitle: p.jobTitle || "Tutor",
  ...(p.image ? { image: p.image } : {}),
  ...(p.university
    ? { alumniOf: { "@type": "CollegeOrUniversity", name: p.university } }
    : {}),
  ...(p.subjects && p.subjects.length ? { knowsAbout: p.subjects } : {}),
  worksFor: { "@id": `${SITE_URL}/#organization` },
  url: `${SITE_URL}/teachers/${p.id}`,
});

export const faqJsonLd = (
  items: Array<{ q: string; a: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
});

export const collectionPageJsonLd = (p: {
  name: string;
  description: string;
  path: string;
  lang?: "ar" | "en";
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: p.name,
  description: p.description,
  url: `${SITE_URL}${p.path}`,
  inLanguage: p.lang === "en" ? "en" : "ar",
  isPartOf: { "@id": `${SITE_URL}/#website` },
});
