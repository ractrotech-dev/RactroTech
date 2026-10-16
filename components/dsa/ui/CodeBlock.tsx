import { LANG_INFO, type Lang } from "@/lib/dsa/lang";

export function CodeBlock({
  code,
  notes,
  lang = "cpp",
}: {
  code: string;
  notes?: { token: string; meaning: string }[];
  lang?: Lang;
}) {
  return (
    <figure className="code-panel">
      <figcaption className="code-lang">{LANG_INFO[lang].label}</figcaption>
      <pre>
        <code>{code}</code>
      </pre>
      {notes ? (
        <dl className="code-notes">
          {notes.map((note) => (
            <div key={note.token}>
              <dt>{note.token}</dt>
              <dd>{note.meaning}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </figure>
  );
}
