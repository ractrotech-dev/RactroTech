export type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export type PreviewMetadata = {
  name: string;
  category: string;
  subtype?: string;
  tags: string[];
  description: string;
  difficulty: string;
  responsive: boolean;
  darkMode: boolean;
};

export type LibraryComponent = {
  id: string;
  title: string;
  description: string;
  code: string;
  created_at: string;
  category_id: string | null;
  slug?: string | null;
  tags?: string[] | null;
  style_variant?: string | null;
  industry_variant?: string | null;
  difficulty?: string | null;
  supports_dark_mode?: boolean | null;
  responsive?: boolean | null;
  preview_metadata?: PreviewMetadata | null;
  content_hash?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug?: string | null;
};

export const ALL_CATEGORY = 'all';
export const UNCATEGORIZED = 'uncategorized';
export const ALL_STYLES = 'all-styles';
export const ALL_INDUSTRIES = 'all-industries';

export type CategoryFilter = typeof ALL_CATEGORY | typeof UNCATEGORIZED | string;
export type StyleFilter = typeof ALL_STYLES | string;
export type IndustryFilter = typeof ALL_INDUSTRIES | string;

export const LIBRARY_SELECT_FIELDS =
  'id, title, description, code, created_at, category_id, slug, tags, style_variant, industry_variant, difficulty, supports_dark_mode, responsive, preview_metadata, content_hash';
