import type { ClientStage } from '@/utils/clients/constants';

export type PlanChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

export type PlanChecklistGroup = {
  id: string;
  title: string;
  items: PlanChecklistItem[];
};

export type OnboardPlanStep = {
  order: number;
  stage: ClientStage;
  title: string;
  description: string;
};

/** UK nations & regions — tick each area you are actively prospecting */
export const UK_REGIONS_CHECKLIST: PlanChecklistGroup = {
  id: 'uk_regions',
  title: 'UK regions to target',
  items: [
    { id: 'london', label: 'London', checked: false },
    { id: 'south_east', label: 'South East', checked: false },
    { id: 'south_west', label: 'South West', checked: false },
    { id: 'east_england', label: 'East of England', checked: false },
    { id: 'west_midlands', label: 'West Midlands', checked: false },
    { id: 'east_midlands', label: 'East Midlands', checked: false },
    { id: 'yorkshire', label: 'Yorkshire & Humber', checked: false },
    { id: 'north_west', label: 'North West', checked: false },
    { id: 'north_east', label: 'North East', checked: false },
    { id: 'scotland', label: 'Scotland', checked: false },
    { id: 'wales', label: 'Wales', checked: false },
    { id: 'northern_ireland', label: 'Northern Ireland', checked: false },
  ],
};

/** Local businesses we build websites for in the UK */
export const UK_BUSINESS_TYPES_CHECKLIST: PlanChecklistGroup = {
  id: 'uk_business_types',
  title: 'UK business types (gyms, cafés, etc.)',
  items: [
    { id: 'gym', label: 'Gym / Fitness studio', checked: false },
    { id: 'cafe', label: 'Café / Coffee shop', checked: false },
    { id: 'restaurant', label: 'Restaurant', checked: false },
    { id: 'bakery', label: 'Bakery', checked: false },
    { id: 'salon', label: 'Salon / Barber', checked: false },
    { id: 'bar_pub', label: 'Bar / Pub', checked: false },
    { id: 'retail', label: 'Retail shop', checked: false },
    { id: 'hotel', label: 'Hotel / B&B', checked: false },
    { id: 'professional', label: 'Professional services', checked: false },
    { id: 'other_local', label: 'Other local business', checked: false },
  ],
};

/** How to find and approach customers on social & other channels */
export const CUSTOMER_ACQUISITION_CHECKLIST: PlanChecklistGroup = {
  id: 'acquisition_channels',
  title: 'How to get customers (outreach channels)',
  items: [
    {
      id: 'facebook',
      label: 'Facebook — find local pages & message owners',
      checked: false,
    },
    {
      id: 'instagram',
      label: 'Instagram — DMs & comments on business profiles',
      checked: false,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn — connect with owners & managers',
      checked: false,
    },
    {
      id: 'google_maps',
      label: 'Google Maps / Search — list businesses needing a site',
      checked: false,
    },
    { id: 'tiktok', label: 'TikTok — local business accounts', checked: false },
    { id: 'email', label: 'Email — cold outreach with portfolio link', checked: false },
    { id: 'phone', label: 'Phone call — follow up after social touch', checked: false },
    { id: 'in_person', label: 'In-person visit — drop card at local shop', checked: false },
    { id: 'referrals', label: 'Referrals — ask happy clients', checked: false },
  ],
};

export const DEFAULT_PLAN_CHECKLISTS: PlanChecklistGroup[] = [
  UK_REGIONS_CHECKLIST,
  UK_BUSINESS_TYPES_CHECKLIST,
  CUSTOMER_ACQUISITION_CHECKLIST,
];

/** End-to-end: list → outreach → onboard → build → complete */
export const RACTROTECH_UK_PIPELINE_STEPS: OnboardPlanStep[] = [
  {
    order: 1,
    stage: 'lead',
    title: 'Build your customer list',
    description:
      'Search gyms, cafés, restaurants, and local shops in your target UK regions. Save name, phone, email, region, and social links into Client List.',
  },
  {
    order: 2,
    stage: 'lead',
    title: 'Research on social platforms',
    description:
      'Check Facebook, Instagram, LinkedIn, Google Maps, and TikTok. Note if they have no website or an outdated one — that is your opportunity.',
  },
  {
    order: 3,
    stage: 'lead',
    title: 'Call or email first contact',
    description:
      'Short intro: you build modern websites for UK local businesses. Offer a free 10‑min call. Log outcome and next step on the client record.',
  },
  {
    order: 4,
    stage: 'lead',
    title: 'Qualify on discovery call',
    description:
      'Confirm budget, timeline, and what they need (menu site, booking, gallery, etc.). Move serious leads to Onboarding stage.',
  },
  {
    order: 5,
    stage: 'onboarding',
    title: 'Onboard the client',
    description:
      'Send proposal, agreement, and invoice. Collect logo, photos, copy, and brand colours. Set milestones in writing.',
  },
  {
    order: 6,
    stage: 'active',
    title: 'Website build process',
    description:
      'Design homepage → inner pages → mobile check → client review. Use a weekly update email until draft is approved.',
  },
  {
    order: 7,
    stage: 'active',
    title: 'Revisions & pre-launch QA',
    description:
      'Apply feedback, test forms/links, speed, and SEO basics. Get written sign-off before go-live.',
  },
  {
    order: 8,
    stage: 'active',
    title: 'Complete & hand off product',
    description:
      'Launch site, deliver login/docs, offer maintenance plan. Mark client Active and ask for review or referral.',
  },
];

export const RACTROTECH_UK_DEFAULT_PLAN = {
  title: 'UK local business — full client playbook',
  description:
    'RactroTech UK plan: target gyms, cafés, and local businesses. Find prospects on social, call or email, onboard, build their website, and complete delivery.',
  category: 'smb' as const,
  steps: RACTROTECH_UK_PIPELINE_STEPS,
  checklists: DEFAULT_PLAN_CHECKLISTS,
};

export const HOW_TO_GET_CUSTOMERS_COPY = {
  headline: 'How to get customers (UK market)',
  intro:
    'We target UK local businesses — gyms, cafés, restaurants, salons, and shops — that need a professional website. Most have Facebook or Instagram but no modern web presence.',
  bullets: [
    'Pick regions from the checklist below and focus one area at a time.',
    'Search Google Maps plus Facebook, Instagram, and LinkedIn for businesses in that area.',
    'Approach owners by DM, email, or phone with a clear offer: we build fast, mobile-friendly sites.',
    'Add every prospect to Client List with region, country, and stage so nothing is lost.',
    'Follow the pipeline steps from first list → call → onboard → build → launch.',
  ],
};

export const UK_COUNTRIES = [
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'England', label: 'England' },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'Wales', label: 'Wales' },
  { value: 'Northern Ireland', label: 'Northern Ireland' },
] as const;

export const UK_REGION_OPTIONS = UK_REGIONS_CHECKLIST.items.map((i) => ({
  value: i.id,
  label: i.label,
}));
