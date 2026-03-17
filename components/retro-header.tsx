"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

const navLinks = [
  { href: "#home", label: "HOME" },
  { href: "#services", label: "SERVICES" },
  { href: "#portfolio", label: "PORTFOLIO" },
  { href: "#about", label: "ABOUT" },
  { href: "#contact", label: "CONTACT" },
  { href: "/components", label: "COMPONENTS" },
];

type HeaderRoleState = "loading" | "guest" | "user" | "admin";

function HeaderCta({ variant = "desktop", onClick }: { variant?: "desktop" | "mobile"; onClick?: () => void }) {
  const [roleState, setRoleState] = useState<HeaderRoleState>("loading");

  useEffect(() => {
    const supabase = createSupabaseClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRoleState("guest");
        return;
      }

      const { data: profile } = await supabase
        .from("users_table")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        setRoleState("admin");
      } else {
        setRoleState("user");
      }
    };

    load();
  }, []);

  // While loading or logged-in non-admin, hide CTA
  if (roleState === "loading" || roleState === "user") {
    return null;
  }

  const baseClasses =
    variant === "desktop"
      ? "retro-button whitespace-nowrap shrink-0"
      : "retro-button text-center mt-2 py-3";

  if (roleState === "guest") {
    return (
      <Link href="/login" onClick={onClick} className={baseClasses}>
        GET STARTED
      </Link>
    );
  }

  // admin
  return (
    <Link href="/dashboard" onClick={onClick} className={baseClasses}>
      GO TO DASHBOARD
    </Link>
  );
}

export function RetroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="retro-border border-b-4 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4 min-w-0">
          <Link href="/" className="min-w-0 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest truncate">
              RACTROTECH
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">Digital Agency</p>
          </Link>

          {/* Desktop nav + CTA */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-bold uppercase text-sm hover:underline whitespace-nowrap"
              >
                {label}
              </a>
            ))}
            <HeaderCta variant="desktop" />
          </nav>

          {/* Hamburger: visible on small screens only */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 shrink-0 retro-border p-2 rounded border-2 bg-white hover:bg-black hover:text-white transition-colors"
          >
            <span
              className={`block w-full h-0.5 bg-current transition-transform origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span className={`block w-full h-0.5 bg-current ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block w-full h-0.5 bg-current transition-transform origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t-2 retro-border bg-white"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-bold uppercase text-sm py-3 px-2 hover:underline border-b border-black/10 last:border-0"
                >
                  {label}
                </a>
              ))}
              <HeaderCta variant="mobile" onClick={() => setMenuOpen(false)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
