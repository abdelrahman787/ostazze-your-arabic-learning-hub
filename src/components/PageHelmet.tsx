import { Helmet } from "react-helmet-async";

interface PageHelmetProps {
  title: string;
  description?: string;
}

const PageHelmet = ({ title, description }: PageHelmetProps) => (
  <Helmet>
    <title>{title} | OSTAZE</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export default PageHelmet;
