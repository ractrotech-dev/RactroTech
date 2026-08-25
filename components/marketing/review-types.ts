/** Shape the marketing sections consume, mapped from `SelectReview` in the page. */
export type MarketingReview = {
  id: string;
  text: string;
  author: string;
  company: string;
  rating?: number | null;
  imageUrl?: string | null;
};
