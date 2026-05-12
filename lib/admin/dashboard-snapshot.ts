import { db } from '@/utils/db/db';
import {
  usersTable,
  projectEnquiriesTable,
  projectsTable,
  clientsTable,
  notificationsTable,
  activityLogsTable,
} from '@/utils/db/schema';
import { sql, desc, eq, inArray } from 'drizzle-orm';

export type DashboardActivityItem = {
  id: string;
  type: 'inquiry' | 'user' | 'project' | 'alert' | 'system';
  title: string;
  description: string;
  time: string;
};

export type ChartPoint = { name: string; value: number };

export type AdminDashboardSnapshot = {
  dbReachable: boolean;
  dbErrorMessage: string | null;
  partialErrors: string[];
  counts: {
    users: number;
    inquiries: number;
    newInquiries: number;
    clients: number;
    projects: number;
    unreadNotifications: number;
    activeProjects: number;
  };
  recentInquiries: {
    id: string;
    name: string;
    email: string | null;
    project_type: string;
    created_at: Date | null;
    status: string | null;
  }[];
  recentUsers: {
    id: string;
    email: string;
    name: string;
    plan: string;
    role: string;
  }[];
  activityItems: DashboardActivityItem[];
  inquirySeries: ChartPoint[];
};

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T, errors: string[]): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`${label}: ${msg}`);
    return fallback;
  }
}

function last7DayLabels(): Date[] {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d);
  }
  return out;
}

function formatDayLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

export async function getAdminDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
  const partialErrors: string[] = [];
  let dbReachable = true;
  let dbErrorMessage: string | null = null;

  const probe = await safe(
    'database',
    async () => {
      await db.execute(sql`select 1`);
      return true;
    },
    false,
    partialErrors,
  );

  if (!probe) {
    dbReachable = false;
    dbErrorMessage = partialErrors[0] ?? 'Database unreachable';
    const emptyDays = last7DayLabels().map((d) => ({ name: formatDayLabel(d), value: 0 }));
    return {
      dbReachable,
      dbErrorMessage,
      partialErrors,
      counts: {
        users: 0,
        inquiries: 0,
        newInquiries: 0,
        clients: 0,
        projects: 0,
        unreadNotifications: 0,
        activeProjects: 0,
      },
      recentInquiries: [],
      recentUsers: [],
      activityItems: [],
      inquirySeries: emptyDays,
    };
  }

  const userCount = await safe(
    'users count',
    async () => {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const inquiryCount = await safe(
    'inquiries count',
    async () => {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(projectEnquiriesTable);
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const newInquiryCount = await safe(
    'new inquiries',
    async () => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectEnquiriesTable)
        .where(eq(projectEnquiriesTable.status, 'new'));
      return Number(row?.count ?? 0);
    },
    inquiryCount,
    partialErrors,
  );

  const clientCount = await safe(
    'clients count',
    async () => {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(clientsTable);
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const projectCount = await safe(
    'projects count',
    async () => {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(projectsTable);
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const activeProjects = await safe(
    'active projects',
    async () => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectsTable)
        .where(
          inArray(projectsTable.status, ['planning', 'in_progress', 'review', 'deployed']),
        );
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const unreadNotifications = await safe(
    'notifications',
    async () => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(notificationsTable)
        .where(eq(notificationsTable.read, false));
      return Number(row?.count ?? 0);
    },
    0,
    partialErrors,
  );

  const recentInquiries = await safe(
    'recent inquiries',
    async () =>
      db
        .select({
          id: projectEnquiriesTable.id,
          name: projectEnquiriesTable.name,
          email: projectEnquiriesTable.email,
          project_type: projectEnquiriesTable.project_type,
          created_at: projectEnquiriesTable.created_at,
          status: projectEnquiriesTable.status,
        })
        .from(projectEnquiriesTable)
        .orderBy(desc(projectEnquiriesTable.created_at))
        .limit(5),
    [],
    partialErrors,
  );

  const recentUsers = await safe(
    'recent users',
    async () =>
      db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          plan: usersTable.plan,
          role: usersTable.role,
        })
        .from(usersTable)
        .orderBy(desc(usersTable.last_login), desc(usersTable.created_at))
        .limit(8),
    [],
    partialErrors,
  );

  const activityLogs = await safe(
    'activity logs',
    async () =>
      db.select().from(activityLogsTable).orderBy(desc(activityLogsTable.created_at)).limit(10),
    [],
    partialErrors,
  );

  const inquiryByDay = await safe(
    'inquiry series',
    async () => {
      const rows = await db.execute(sql`
        SELECT TO_CHAR((created_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day_key,
               COUNT(*)::int AS value
        FROM project_enquiries
        WHERE created_at >= NOW() - INTERVAL '9 days'
        GROUP BY 1
        ORDER BY 1
      `);
      const map = new Map<string, number>();
      const list = rows as unknown as { day_key: string; value: number }[];
      for (const r of list) {
        if (r.day_key) map.set(String(r.day_key), Number(r.value) || 0);
      }
      return map;
    },
    new Map<string, number>(),
    partialErrors,
  );

  const days = last7DayLabels();
  const inquirySeries: ChartPoint[] = days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    return { name: formatDayLabel(d), value: inquiryByDay.get(key) ?? 0 };
  });

  const activityItems: DashboardActivityItem[] = [
    ...activityLogs.map((log) => ({
      id: log.id,
      type: 'system' as const,
      title: log.action,
      description: log.entity_type ? `Entity: ${log.entity_type}` : 'Audit event',
      time: log.created_at
        ? new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Recent',
    })),
    ...recentInquiries
      .filter((inq) => !activityLogs.some((log) => log.entity_id === inq.id))
      .map((inq) => ({
        id: inq.id,
        type: 'inquiry' as const,
        title: `Inquiry from ${inq.name}`,
        description: inq.project_type,
        time: inq.created_at
          ? new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'Recent',
      })),
  ]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 10);

  return {
    dbReachable,
    dbErrorMessage,
    partialErrors,
    counts: {
      users: userCount,
      inquiries: inquiryCount,
      newInquiries: newInquiryCount,
      clients: clientCount,
      projects: projectCount,
      unreadNotifications,
      activeProjects,
    },
    recentInquiries,
    recentUsers,
    activityItems,
    inquirySeries,
  };
}
