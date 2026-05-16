import { redirect } from 'next/navigation';

/** Common typo: /reviews → /review */
export default function ReviewsRedirectPage() {
  redirect('/review');
}
