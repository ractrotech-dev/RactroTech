"use client";

import { useState } from "react";
import { useAuthModal } from "@/contexts/auth-modal-context";
import type { Challenge } from "@/lib/dsa/lessons/types";
import { grade } from "@/lib/dsa/lessons/checkCode";
import { LANG_INFO, type Lang } from "@/lib/dsa/lang";
import { recordSolve, type SaveState } from "@/lib/dsa/progress/record";

export function CodePad({
  challenge,
  topicId,
  sectionId,
  lang = "cpp",
}: {
  challenge: Challenge;
  topicId?: string;
  sectionId?: string;
  lang?: Lang;
}) {
  const [code, setCode] = useState(challenge.starter);
  const [seeded, setSeeded] = useState(challenge.starter);

  // Switching language swaps the starter under the reader. Only reset the box
  // when they have not typed anything of their own into it.
  if (challenge.starter !== seeded) {
    setSeeded(challenge.starter);
    if (code === seeded) setCode(challenge.starter);
  }
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState<SaveState | null>(null);
  const { openLoginModal } = useAuthModal();

  async function check() {
    const verdict = grade(code, challenge.rules, lang);
    setResult(verdict);
    setSaved(null);

    if (verdict.ok && topicId && sectionId) {
      setSaved("saving");
      setSaved(await recordSolve({ topicId, sectionId, code, passed: true }));
    }
  }

  return (
    <div className="pad">
      <div className="pad-top">
        <span>{LANG_INFO[lang].label} pad</span>
        <span>type your walk</span>
      </div>
      <p className="pad-quest">{challenge.prompt}</p>
      <textarea
        className="pad-input"
        value={code}
        spellCheck={false}
        aria-label={`${LANG_INFO[lang].label} code`}
        onKeyDown={(e) => {
          // Tab should indent, not jump to the next control.
          if (e.key !== "Tab") return;
          e.preventDefault();
          const el = e.currentTarget;
          const { selectionStart: s, selectionEnd: t } = el;
          const next = `${code.slice(0, s)}  ${code.slice(t)}`;
          setCode(next);
          requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
        }}
        onChange={(e) => {
          setCode(e.target.value);
          setResult(null);
          setSaved(null);
        }}
      />
      <div className="pad-actions">
        <button type="button" className="pad-run" onClick={check}>
          Check
        </button>
        <button type="button" className="pad-ghost" onClick={() => setShow((v) => !v)}>
          {show ? "Hide solution" : "Show solution"}
        </button>
        <button
          type="button"
          className="pad-ghost"
          onClick={() => {
            setCode(challenge.starter);
            setResult(null);
            setSaved(null);
            setShow(false);
          }}
        >
          Reset
        </button>
      </div>
      {result ? (
        <p className="pad-result" data-ok={result.ok}>
          {result.ok ? "Yes. " : "Not yet. "}
          {result.message}
        </p>
      ) : null}
      {saved && saved !== "off" ? (
        <p className="pad-saved" data-state={saved}>
          {saved === "saving"
            ? "Saving…"
            : saved === "saved"
              ? "Saved. Today's square is filled in."
              : saved === "anon"
                ? (
                    <>
                      Not saved —{" "}
                      {/* The site's login modal keeps the reader on this lesson, and the
                          pending action saves this answer the moment they are signed in. */}
                      <button
                        type="button"
                        className="pad-link"
                        onClick={() => openLoginModal(() => void check())}
                      >
                        sign in
                      </button>{" "}
                      to keep a streak.
                    </>
                  )
                : "Could not save that one. Your answer is still correct."}
        </p>
      ) : null}
      {show ? (
        <pre className="pad-solution">
          <code>{challenge.solution}</code>
        </pre>
      ) : null}
    </div>
  );
}
