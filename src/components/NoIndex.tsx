import { Helmet } from "react-helmet-async";

interface NoIndexProps {
  title?: string;
}

/**
 * Minimal Helmet that prevents indexing for private/authenticated pages.
 * Use on /login, /register, /dashboard*, /admin, /lectures/*, /checkout/*.
 */
const NoIndex = ({ title }: NoIndexProps) => (
  <Helmet>
    {title && <title>{title} | OSTAZE</title>}
    <meta name="robots" content="noindex,nofollow" />
    <meta name="googlebot" content="noindex,nofollow" />
  </Helmet>
);

export default NoIndex;
