interface NoIndexProps {
  title?: string;
}

/**
 * Prevents indexing for private/authenticated pages. React 19 hoists these tags into <head>,
 * including in the server response.
 */
const NoIndex = ({ title }: NoIndexProps) => (
  <>
    {title && <title>{`${title} | OSTAZE`}</title>}
    <meta name="robots" content="noindex,nofollow" />
    <meta name="googlebot" content="noindex,nofollow" />
  </>
);

export default NoIndex;
