import { LANG_INFO, type Lang } from "@/lib/dsa/lang";

/**
 * Flattens code so grading can look for a shape rather than exact formatting.
 *
 * Comments are stripped so a hint left in a comment cannot satisfy a rule, and
 * whitespace is collapsed so indentation never matters.
 *
 * The scan is quote-aware. A naive regex would treat the # in a Python trie's
 * `cur["#"] = True` as the start of a comment and delete the rest of the line —
 * which silently rejected a correct answer until scripts/check-lessons caught it.
 */
export function squash(code: string, lang: Lang = "cpp") {
  const marker = LANG_INFO[lang].comment;
  let out = "";
  let quote: string | null = null;

  for (let i = 0; i < code.length; i++) {
    const c = code[i];

    if (quote) {
      out += c;
      if (c === "\\") {
        // Keep the escaped character with it, so \" does not end the string.
        if (i + 1 < code.length) out += code[++i];
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }

    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      continue;
    }

    // A comment outside quotes: drop the rest of the line.
    if (marker === "#" ? c === "#" : c === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      out += "\n";
      continue;
    }

    // Block comments, for the C-family languages.
    if (marker === "//" && c === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i++;
      out += " ";
      continue;
    }

    out += c;
  }

  return out.replace(/\s+/g, " ").trim();
}

export type GradeRules = {
  must?: string[];
  mustNot?: string[];
  regex?: string[];
  hint: string;
  success: string;
};

export function grade(code: string, rules: GradeRules, lang: Lang = "cpp") {
  const s = squash(code, lang);
  if (s.length < 4) {
    return { ok: false, message: "Type some code in the box first." };
  }
  for (const piece of rules.must ?? []) {
    if (!s.includes(piece)) {
      return { ok: false, message: rules.hint };
    }
  }
  for (const piece of rules.mustNot ?? []) {
    if (s.includes(piece)) {
      return { ok: false, message: rules.hint };
    }
  }
  for (const pattern of rules.regex ?? []) {
    if (!new RegExp(pattern).test(s)) {
      return { ok: false, message: rules.hint };
    }
  }
  return { ok: true, message: rules.success };
}
