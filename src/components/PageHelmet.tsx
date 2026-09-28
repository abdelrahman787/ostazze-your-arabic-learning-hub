import { useLocation } from "@/lib/router-compat";

interface PageHelmetProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SITE = "https://ostaze.com";
const DEFAULT_OG =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Z79KI50YEuSGVGIjgK4BMa4CRzy2/social-images/social-1774873100528-edu-ostazze.webp";

const PageHelmet = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG,
  ogType = "website",
  noindex = false,
  jsonLd,
}: PageHelmetProps) => {
  const { pathname } = useLocation();
  const fullTitle = title.includes("OSTAZE") ? title : `${title} | OSTAZE`;
  // Canonical is always self-referencing, https://ostaze.com, no query, no trailing slash.
  const normalize = (u: string) =>
    u.replace(/[?#].*$/, "").replace(/(.)\/+$/, "$1");
  const url = normalize(canonical || `${SITE}${pathname}`);
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="OSTAZE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {ldArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          // React 19 renders <title>/<meta>/<link> straight into <head> (also during server rendering).
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ld).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
};

export default PageHelmet;
