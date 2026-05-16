export const REVIEW_PROJECT_TYPES = [
  { value: 'fullstack', label: 'Full stack project' },
  { value: 'chatbot', label: 'AI & chatbot' },
  { value: 'cloud', label: 'Cloud services (AWS / Azure)' },
  { value: 'saas', label: 'SaaS platform' },
  { value: 'mobile', label: 'Mobile development' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'automation', label: 'Internal automation' },
  { value: 'other', label: 'Other' },
] as const;

export type ReviewProjectType = (typeof REVIEW_PROJECT_TYPES)[number]['value'];

export const REVIEW_PROJECT_TYPE_SET = new Set<string>(
  REVIEW_PROJECT_TYPES.map((t) => t.value),
);
