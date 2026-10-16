"use client";

import { useLang } from "@/components/dsa/lang/LangProvider";
import { LANGS, LANG_INFO } from "@/lib/dsa/lang";

export function LangPicker({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-pick" data-compact={compact} role="group" aria-label="Code language">
      {!compact ? <span className="lang-pick-label">Show the code in</span> : null}
      <div className="lang-tabs">
        {LANGS.map((id) => (
          <button
            type="button"
            key={id}
            className="lang-tab"
            data-on={lang === id}
            aria-pressed={lang === id}
            title={LANG_INFO[id].label}
            onClick={() => setLang(id)}
          >
            {compact ? LANG_INFO[id].short : LANG_INFO[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}
