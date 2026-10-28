/** Structured data for search engines, one script per graph. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON; escaping "<" keeps a value from closing the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}
