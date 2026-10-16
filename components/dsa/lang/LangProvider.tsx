"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { browserClient } from "@/lib/dsa/supabase/client";
import { DEFAULT_LANG, LANG_STORAGE_KEY, langOr, type Lang } from "@/lib/dsa/lang";

type Ctx = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /** False until the stored choice has been read, so nothing flashes wrongly. */
  ready: boolean;
};

const LangContext = createContext<Ctx>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  ready: false,
});

export function useLang() {
  return useContext(LangContext);
}

/**
 * Holds the reader's language.
 *
 * Lesson pages are pre-rendered, so the server cannot know the choice — it
 * always renders C++ and this swaps on hydration. localStorage is the source of
 * truth for reading; a signed-in profile overrides it once loaded, and writing
 * updates both.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored) setLangState(langOr(stored));
    } catch {
      // Private mode, or site data blocked. C++ is a fine default.
    }
    setReady(true);

    const supabase = browserClient();
    if (!supabase) return;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !alive) return;

      // Errors here are ignored on purpose: if the column has not been
      // migrated yet the stored preference simply does not apply.
      const { data } = await supabase
        .from("dsa_profiles")
        .select("lang")
        .eq("id", user.id)
        .maybeSingle();

      if (alive && data?.lang) setLangState(langOr(data.lang));
    })();

    return () => {
      alive = false;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Not fatal — the choice just will not survive a reload.
    }

    const supabase = browserClient();
    if (!supabase) return;
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // Upsert, not update: a Ractrotech account has no course row until it first saves.
      await supabase.from("dsa_profiles").upsert({ id: user.id, lang: next });
    })();
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, ready }}>
      {children}
    </LangContext.Provider>
  );
}
