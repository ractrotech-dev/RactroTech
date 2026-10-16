"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/dsa/progress/record";

/** Counts one visit per lesson page load. Invisible, and silent on failure. */
export function VisitRecorder() {
  useEffect(() => {
    void recordVisit();
  }, []);
  return null;
}
