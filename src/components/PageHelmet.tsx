import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface PageHelmetProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SITE = "https://ostaze.com";
const DEFAULT_OG = "https://storage.googleapis.com/gpt-engineer-file-uploads/Z79KI50YEuSGVGIjgK4BMa4CRzy2/social-images/social-1774873100528-edu-ostazze.webp";

const PageHelmet = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  ogType = "website",
  noindex = false,
  jsonLd,
}: PageHelmetProps) => {
  const { pathname } = useLocation();
  const fullTitle = title.includes("OSTAZE") ? title : `${title} | OSTAZE`;
  const url = canonical || `${SITE}${pathname}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
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
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default PageHelmet;
