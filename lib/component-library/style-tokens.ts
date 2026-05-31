import type { LibraryIndustry, LibraryStyle } from './constants';

export type StyleTokenSet = {
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  border: string;
  ring: string;
  radius: string;
  shadow: string;
  container: string;
  card: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonGhost: string;
  input: string;
  darkSurface?: string;
  darkText?: string;
};

const STYLE_BASE: Record<LibraryStyle, StyleTokenSet> = {
  minimal: {
    surface: 'bg-white',
    surfaceMuted: 'bg-slate-50',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    accent: 'bg-slate-900',
    accentText: 'text-white',
    border: 'border-slate-200',
    ring: 'focus-visible:ring-slate-400',
    radius: 'rounded-lg',
    shadow: 'shadow-sm',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-slate-200 rounded-lg shadow-sm',
    buttonPrimary:
      'inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold bg-white text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors',
    input:
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
    darkSurface: 'dark:bg-slate-950',
    darkText: 'dark:text-slate-100',
  },
  modern: {
    surface: 'bg-zinc-50',
    surfaceMuted: 'bg-white',
    text: 'text-zinc-900',
    textMuted: 'text-zinc-500',
    accent: 'bg-indigo-600',
    accentText: 'text-white',
    border: 'border-zinc-200',
    ring: 'focus-visible:ring-indigo-500',
    radius: 'rounded-xl',
    shadow: 'shadow-md',
    container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    card: 'bg-white border border-zinc-200 rounded-xl shadow-md',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-zinc-900 border border-zinc-300 rounded-xl hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-indigo-600 rounded-xl hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors',
    input:
      'w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
    darkSurface: 'dark:bg-zinc-950',
    darkText: 'dark:text-zinc-50',
  },
  glassmorphism: {
    surface: 'bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20',
    surfaceMuted: 'bg-white/40 backdrop-blur-md',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    accent: 'bg-indigo-600/90 backdrop-blur',
    accentText: 'text-white',
    border: 'border-white/40',
    ring: 'focus-visible:ring-indigo-400',
    radius: 'rounded-2xl',
    shadow: 'shadow-xl shadow-indigo-500/10',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-indigo-600/90 backdrop-blur text-white rounded-2xl hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white/60 backdrop-blur text-slate-900 border border-white/50 rounded-2xl hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-indigo-700 rounded-2xl hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 transition-colors',
    input:
      'w-full rounded-2xl border border-white/50 bg-white/60 backdrop-blur px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
    darkSurface: 'dark:from-slate-900/80',
    darkText: 'dark:text-slate-100',
  },
  neumorphism: {
    surface: 'bg-slate-200',
    surfaceMuted: 'bg-slate-200',
    text: 'text-slate-700',
    textMuted: 'text-slate-500',
    accent: 'bg-slate-200',
    accentText: 'text-indigo-600',
    border: 'border-slate-200',
    ring: 'focus-visible:ring-indigo-400',
    radius: 'rounded-2xl',
    shadow: 'shadow-lg shadow-slate-400/25',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-slate-200 rounded-2xl shadow-lg shadow-slate-400/25 p-6',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-indigo-600 bg-slate-200 rounded-2xl shadow-inner shadow-slate-400/30 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-200 rounded-2xl shadow-md shadow-slate-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-600 rounded-2xl hover:shadow-inner hover:shadow-slate-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors',
    input:
      'w-full rounded-2xl bg-slate-200 px-3 py-2.5 text-sm shadow-inner shadow-slate-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
    darkSurface: 'dark:bg-slate-800',
    darkText: 'dark:text-slate-200',
  },
  corporate: {
    surface: 'bg-slate-100',
    surfaceMuted: 'bg-white',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    accent: 'bg-blue-700',
    accentText: 'text-white',
    border: 'border-slate-300',
    ring: 'focus-visible:ring-blue-600',
    radius: 'rounded-md',
    shadow: 'shadow-sm',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    card: 'bg-white border border-slate-300 rounded-md shadow-sm',
    buttonPrimary:
      'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-blue-700 text-white rounded-md hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-white text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-blue-700 rounded-md hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors',
    input:
      'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
    darkSurface: 'dark:bg-slate-900',
    darkText: 'dark:text-slate-100',
  },
  luxury: {
    surface: 'bg-stone-950',
    surfaceMuted: 'bg-stone-900',
    text: 'text-stone-100',
    textMuted: 'text-stone-400',
    accent: 'bg-amber-500',
    accentText: 'text-stone-950',
    border: 'border-stone-700',
    ring: 'focus-visible:ring-amber-400',
    radius: 'rounded-sm',
    shadow: 'shadow-2xl shadow-black/40',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-stone-900 border border-stone-700 rounded-sm shadow-2xl',
    buttonPrimary:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide bg-amber-500 text-stone-950 rounded-sm hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide bg-transparent text-amber-400 border border-amber-500/50 rounded-sm hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-stone-300 rounded-sm hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors',
    input:
      'w-full rounded-sm border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
    darkSurface: 'dark:bg-stone-950',
    darkText: 'dark:text-stone-100',
  },
  'dark-theme': {
    surface: 'bg-slate-950',
    surfaceMuted: 'bg-slate-900',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'bg-violet-500',
    accentText: 'text-white',
    border: 'border-slate-800',
    ring: 'focus-visible:ring-violet-400',
    radius: 'rounded-xl',
    shadow: 'shadow-lg shadow-black/30',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-slate-900 border border-slate-800 rounded-xl shadow-lg',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-violet-500 text-white rounded-xl hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-slate-800 text-slate-100 border border-slate-700 rounded-xl hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-violet-400 rounded-xl hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition-colors',
    input:
      'w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
    darkSurface: 'dark:bg-slate-950',
    darkText: 'dark:text-slate-100',
  },
  startup: {
    surface: 'bg-orange-50',
    surfaceMuted: 'bg-white',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    accent: 'bg-orange-500',
    accentText: 'text-white',
    border: 'border-orange-200',
    ring: 'focus-visible:ring-orange-400',
    radius: 'rounded-2xl',
    shadow: 'shadow-lg shadow-orange-500/10',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-orange-200 rounded-2xl shadow-lg',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-orange-500 text-white rounded-2xl hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-orange-600 border border-orange-300 rounded-2xl hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-orange-600 rounded-2xl hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 transition-colors',
    input:
      'w-full rounded-2xl border border-orange-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
    darkSurface: 'dark:bg-gray-950',
    darkText: 'dark:text-gray-100',
  },
  'ai-product': {
    surface: 'bg-gradient-to-b from-slate-950 to-indigo-950',
    surfaceMuted: 'bg-slate-900/80',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    accent: 'bg-cyan-400',
    accentText: 'text-slate-950',
    border: 'border-cyan-500/30',
    ring: 'focus-visible:ring-cyan-400',
    radius: 'rounded-2xl',
    shadow: 'shadow-xl shadow-cyan-500/10',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-slate-900/80 border border-cyan-500/20 rounded-2xl shadow-xl backdrop-blur',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-cyan-400 text-slate-950 rounded-2xl hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-transparent text-cyan-400 border border-cyan-500/40 rounded-2xl hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-cyan-300 rounded-2xl hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors',
    input:
      'w-full rounded-2xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
    darkSurface: 'dark:bg-slate-950',
    darkText: 'dark:text-slate-100',
  },
  fintech: {
    surface: 'bg-emerald-950',
    surfaceMuted: 'bg-emerald-900/50',
    text: 'text-emerald-50',
    textMuted: 'text-emerald-300/70',
    accent: 'bg-emerald-400',
    accentText: 'text-emerald-950',
    border: 'border-emerald-700/50',
    ring: 'focus-visible:ring-emerald-400',
    radius: 'rounded-lg',
    shadow: 'shadow-lg',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-emerald-900/40 border border-emerald-700/50 rounded-lg shadow-lg',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-emerald-400 text-emerald-950 rounded-lg hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-emerald-400 border border-emerald-600 rounded-lg hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-emerald-300 rounded-lg hover:bg-emerald-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors',
    input:
      'w-full rounded-lg border border-emerald-700 bg-emerald-950/50 px-3 py-2.5 text-sm text-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
    darkSurface: 'dark:bg-emerald-950',
    darkText: 'dark:text-emerald-50',
  },
  healthcare: {
    surface: 'bg-sky-50',
    surfaceMuted: 'bg-white',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    accent: 'bg-sky-600',
    accentText: 'text-white',
    border: 'border-sky-200',
    ring: 'focus-visible:ring-sky-500',
    radius: 'rounded-2xl',
    shadow: 'shadow-md',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-sky-200 rounded-2xl shadow-md',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-sky-600 text-white rounded-2xl hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-sky-700 border border-sky-300 rounded-2xl hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-sky-700 rounded-2xl hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-colors',
    input:
      'w-full rounded-2xl border border-sky-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
    darkSurface: 'dark:bg-slate-900',
    darkText: 'dark:text-slate-100',
  },
  education: {
    surface: 'bg-violet-50',
    surfaceMuted: 'bg-white',
    text: 'text-violet-950',
    textMuted: 'text-violet-600/70',
    accent: 'bg-violet-600',
    accentText: 'text-white',
    border: 'border-violet-200',
    ring: 'focus-visible:ring-violet-500',
    radius: 'rounded-xl',
    shadow: 'shadow-md',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-violet-200 rounded-xl shadow-md',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-violet-700 border border-violet-300 rounded-xl hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-violet-700 rounded-xl hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors',
    input:
      'w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
    darkSurface: 'dark:bg-violet-950',
    darkText: 'dark:text-violet-50',
  },
  'food-delivery': {
    surface: 'bg-red-50',
    surfaceMuted: 'bg-white',
    text: 'text-red-950',
    textMuted: 'text-red-600/70',
    accent: 'bg-red-500',
    accentText: 'text-white',
    border: 'border-red-200',
    ring: 'focus-visible:ring-red-400',
    radius: 'rounded-full',
    shadow: 'shadow-lg',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-red-200 rounded-3xl shadow-lg',
    buttonPrimary:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-bold bg-red-500 text-white rounded-full hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-white text-red-600 border border-red-300 rounded-full hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-red-600 rounded-full hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors',
    input:
      'w-full rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
    darkSurface: 'dark:bg-red-950',
    darkText: 'dark:text-red-50',
  },
  travel: {
    surface: 'bg-teal-50',
    surfaceMuted: 'bg-white',
    text: 'text-teal-950',
    textMuted: 'text-teal-600/70',
    accent: 'bg-teal-600',
    accentText: 'text-white',
    border: 'border-teal-200',
    ring: 'focus-visible:ring-teal-500',
    radius: 'rounded-2xl',
    shadow: 'shadow-md',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-teal-200 rounded-2xl shadow-md overflow-hidden',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-2xl hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-teal-700 border border-teal-300 rounded-2xl hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-teal-700 rounded-2xl hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors',
    input:
      'w-full rounded-2xl border border-teal-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
    darkSurface: 'dark:bg-teal-950',
    darkText: 'dark:text-teal-50',
  },
  'real-estate': {
    surface: 'bg-amber-50',
    surfaceMuted: 'bg-white',
    text: 'text-amber-950',
    textMuted: 'text-amber-800/60',
    accent: 'bg-amber-800',
    accentText: 'text-amber-50',
    border: 'border-amber-200',
    ring: 'focus-visible:ring-amber-600',
    radius: 'rounded-lg',
    shadow: 'shadow-md',
    container: 'max-w-6xl mx-auto px-4 sm:px-6',
    card: 'bg-white border border-amber-200 rounded-lg shadow-md',
    buttonPrimary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 transition-colors',
    buttonSecondary:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-white text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 transition-colors',
    buttonGhost:
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-amber-800 rounded-lg hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 transition-colors',
    input:
      'w-full rounded-lg border border-amber-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600',
    darkSurface: 'dark:bg-amber-950',
    darkText: 'dark:text-amber-50',
  },
};

const INDUSTRY_LABELS: Record<LibraryIndustry, string> = {
  saas: 'RactroTech Cloud',
  fintech: 'PayFlow',
  healthcare: 'MediCare Plus',
  education: 'LearnHub',
  'food-delivery': 'QuickBite',
  travel: 'Wanderly',
  'real-estate': 'HomeVault',
  ecommerce: 'ShopNova',
  agency: 'Studio Apex',
  startup: 'LaunchPad',
  ai: 'NeuralWorks',
  corporate: 'Enterprise Co',
  luxury: 'Maison Luxe',
  nonprofit: 'Hope Foundation',
  media: 'Streamline Media',
};

export function getStyleTokens(style: LibraryStyle): StyleTokenSet {
  return STYLE_BASE[style];
}

export function getIndustryLabel(industry: LibraryIndustry): string {
  return INDUSTRY_LABELS[industry];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
