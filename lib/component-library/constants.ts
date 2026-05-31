export const LIBRARY_STYLES = [
  'minimal',
  'modern',
  'glassmorphism',
  'neumorphism',
  'corporate',
  'luxury',
  'dark-theme',
  'startup',
  'ai-product',
  'fintech',
  'healthcare',
  'education',
  'food-delivery',
  'travel',
  'real-estate',
] as const;

export const LIBRARY_INDUSTRIES = [
  'saas',
  'fintech',
  'healthcare',
  'education',
  'food-delivery',
  'travel',
  'real-estate',
  'ecommerce',
  'agency',
  'startup',
  'ai',
  'corporate',
  'luxury',
  'nonprofit',
  'media',
] as const;

export const LIBRARY_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

export type LibraryStyle = (typeof LIBRARY_STYLES)[number];
export type LibraryIndustry = (typeof LIBRARY_INDUSTRIES)[number];
export type LibraryDifficulty = (typeof LIBRARY_DIFFICULTIES)[number];

export const LIBRARY_CATEGORIES: Record<string, string[]> = {
  Buttons: ['primary', 'secondary', 'ghost', 'gradient', 'animated', 'icon', 'floating', 'social-login'],
  Cards: ['product', 'user', 'pricing', 'testimonial', 'feature', 'analytics'],
  Forms: ['login', 'register', 'forgot-password', 'search', 'multi-step', 'contact'],
  Navigation: ['navbar', 'mobile-menu', 'mega-menu', 'sidebar', 'bottom-nav'],
  Hero: ['saas', 'ai-startup', 'food-delivery', 'ecommerce', 'agency', 'portfolio'],
  Dashboards: ['analytics', 'finance', 'crm', 'ecommerce', 'admin'],
  Tables: ['data', 'sortable', 'searchable', 'paginated'],
  Charts: ['revenue', 'user-growth', 'sales', 'traffic'],
  Pricing: ['three-tier', 'toggle-billing', 'comparison', 'simple'],
  Testimonials: ['grid', 'carousel', 'single-spotlight', 'logo-wall'],
  FAQs: ['accordion', 'two-column', 'tabbed', 'minimal'],
  Footers: ['simple', 'mega', 'minimal', 'newsletter'],
  CTAs: ['banner', 'split', 'centered', 'floating'],
  'Feature Grids': ['three-col', 'bento', 'icon-grid', 'alternating'],
  Statistics: ['four-up', 'highlight', 'timeline', 'comparison'],
  Blog: ['card-grid', 'featured', 'magazine', 'minimal-list'],
  Auth: ['login', 'register', 'split', 'otp'],
  Profile: ['header-card', 'settings-tabs', 'activity', 'team'],
  Settings: ['sidebar-nav', 'sections', 'billing', 'notifications'],
  Notifications: ['toast', 'inbox', 'banner', 'dropdown'],
  Chat: ['sidebar-thread', 'bubble', 'support', 'group'],
  'E-commerce': ['product-grid', 'cart-drawer', 'checkout', 'filters'],
};

export const LIBRARY_WAVES = [
  { id: 1, categories: ['Buttons', 'Cards', 'CTAs', 'Footers'], target: 400 },
  { id: 2, categories: ['Forms', 'Navigation', 'Hero', 'Feature Grids'], target: 600 },
  { id: 3, categories: ['Pricing', 'Testimonials', 'FAQs', 'Statistics', 'Blog'], target: 600 },
  {
    id: 4,
    categories: ['Dashboards', 'Tables', 'Charts', 'Auth', 'Profile', 'Settings'],
    target: 800,
  },
  { id: 5, categories: ['Notifications', 'Chat', 'E-commerce'], target: 600 },
] as const;

export const LIBRARY_TOTAL_TARGET = LIBRARY_WAVES.reduce((sum, w) => sum + w.target, 0);
