"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dsa", label: "Map", match: (p: string) => p === "/dsa" },
  {
    href: "/dsa/learn/intro",
    label: "Syllabus",
    match: (p: string) => p.startsWith("/dsa/learn/intro") || p.startsWith("/dsa/learn/topic"),
  },
  { href: "/dsa/learn/language", label: "Language", match: (p: string) => p.startsWith("/dsa/learn/language") },
  {
    href: "/dsa/profile",
    label: "My progress",
    match: (p: string) => p.startsWith("/dsa/profile") || p.startsWith("/dsa/welcome"),
  },
];

/**
 * The course's own bar, under the site header. It replaces the per-page "back to the map"
 * buttons the standalone app had, and the corner sign-in badge: signing in now happens in
 * the site header, and "My progress" sends a signed-out reader to /login.
 */
export function DsaNav() {
  const pathname = usePathname();

  return (
    <nav className="dsa-nav" aria-label="Learn DSA">
      <div className="dsa-nav-in">
        <Link href="/dsa" className="dsa-nav-brand">
          <span className="dsa-nav-mark" aria-hidden="true" />
          Learn DSA
        </Link>
        <div className="dsa-nav-links">
          {LINKS.map((link) => {
            const on = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="dsa-nav-link"
                data-on={on}
                aria-current={on ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
