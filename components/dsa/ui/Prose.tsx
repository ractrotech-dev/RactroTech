/**
 * Renders one paragraph of lesson prose.
 *
 * The only markup the lessons use is a backtick pair around a fragment of code
 * — `vector<int>`, `d.get(k)`. Everything else is plain text, deliberately, so
 * there is no parser here beyond splitting on the backtick.
 *
 * An unmatched backtick is left as ordinary text rather than swallowing the
 * rest of the paragraph.
 */
export function Prose({ text }: { text: string }) {
  if (!text.includes("`")) return <>{text}</>;

  const parts = text.split("`");
  // An even number of pieces means an unmatched backtick: leave it alone.
  if (parts.length % 2 === 0) return <>{text}</>;

  return (
    <>
      {parts.map((piece, i) =>
        i % 2 === 1 ? (
          <code className="tick" key={i}>
            {piece}
          </code>
        ) : (
          <span key={i}>{piece}</span>
        ),
      )}
    </>
  );
}
