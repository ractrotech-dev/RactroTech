import { syncRunningJobs } from '@/lib/outreach/apify';
import { sendBatch, syncReplies } from '@/lib/outreach/mailer';

export const dynamic = 'force-dynamic';

// Lead finder scheduler. Hit it every ~10 minutes to import finished scrapes, drip-send
// active campaigns and check for replies:
//   curl -H "Authorization: Bearer $CRON_SECRET" https://www.ractrotech.com/api/outreach/cron
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(request.url);
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? url.searchParams.get('secret');
  if (!secret || given !== secret) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const jobsSynced = await syncRunningJobs();
  const mail = await sendBatch();
  const replies = await syncReplies().catch((e: unknown) => ({ error: e instanceof Error ? e.message : String(e) }));
  return Response.json({ jobsSynced, ...mail, replies });
}
