"use client";

import { motion, useReducedMotion } from "framer-motion";

const defaultViewport = { once: true, margin: "-40px" as const };

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function FadeInView({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
}: FadeInViewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: prefersReducedMotion ? 0 : duration, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="show"
      whileInView="show"
      viewport={defaultViewport}
    >
      {children}
    </motion.div>
  );
}

export const staggerItemVariants = staggerItem;
