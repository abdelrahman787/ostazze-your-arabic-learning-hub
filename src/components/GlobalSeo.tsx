import { Helmet } from "react-helmet-async";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Site-wide structured data: Organization + WebSite + SearchAction.
 * Mounted once at the App level.
 */
const GlobalSeo = () => {
  const { lang } = useLanguage();
  return (
    <Helmet>
      <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} />
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd(lang))}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd(lang))}
      </script>
    </Helmet>
  );
};

export default GlobalSeo;
