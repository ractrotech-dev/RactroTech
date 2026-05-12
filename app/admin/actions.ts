'use server';

import { db } from '@/utils/db/db';
import {
  usersTable,
  projectEnquiriesTable,
  inquiryNotesTable,
  clientsTable,
  projectsTable,
  projectTasksTable,
  projectMilestonesTable,
  postsTable,
  mediaAssetsTable,
  siteSettingsTable,
  notificationsTable,
  activityLogsTable,
} from '@/utils/db/schema';
import { eq, desc, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/utils/admin';

// ─── Helper ────────────────────────────────────────────────────────────────────
async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

async function logActivity(userId: string, action: string, entityType: string, entityId?: string) {
  try {
    await db.insert(activityLogsTable).values({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
    });
  } catch {
    // Silently fail if table doesn't exist yet
  }
}

// ─── Inquiry Actions ───────────────────────────────────────────────────────────

export async function updateInquiryStatus(id: string, status: 'new' | 'in_progress' | 'responded' | 'converted' | 'closed') {
  const admin = await requireAdmin();
  await db.update(projectEnquiriesTable)
    .set({ status, updated_at: new Date() })
    .where(eq(projectEnquiriesTable.id, id));

  await logActivity(admin.id, `Updated inquiry status to ${status}`, 'inquiry', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

export async function updateInquiryPriority(id: string, priority: 'low' | 'medium' | 'high' | 'urgent') {
  const admin = await requireAdmin();
  await db.update(projectEnquiriesTable)
    .set({ priority, updated_at: new Date() })
    .where(eq(projectEnquiriesTable.id, id));

  await logActivity(admin.id, `Updated inquiry priority to ${priority}`, 'inquiry', id);
  revalidatePath('/admin/inquiries');
}

export async function addInquiryNote(inquiryId: string, content: string) {
  const admin = await requireAdmin();
  await db.insert(inquiryNotesTable).values({
    inquiry_id: inquiryId,
    author_id: admin.id,
    content,
  });

  await logActivity(admin.id, 'Added note to inquiry', 'inquiry', inquiryId);
  revalidatePath('/admin/inquiries');
}

export async function convertInquiryToClient(inquiryId: string) {
  const admin = await requireAdmin();

  // Get the inquiry
  const [inquiry] = await db.select().from(projectEnquiriesTable).where(eq(projectEnquiriesTable.id, inquiryId));
  if (!inquiry) throw new Error('Inquiry not found');

  // Create client
  await db.insert(clientsTable).values({
    name: inquiry.name,
    email: inquiry.email || '',
    phone: inquiry.phone,
    status: 'onboarding',
    inquiry_id: inquiryId,
  });

  // Update inquiry status
  await db.update(projectEnquiriesTable)
    .set({ status: 'converted', updated_at: new Date() })
    .where(eq(projectEnquiriesTable.id, inquiryId));

  await logActivity(admin.id, 'Converted inquiry to client', 'inquiry', inquiryId);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin/clients');
  revalidatePath('/admin');
}

// ─── Client Actions ────────────────────────────────────────────────────────────

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}) {
  const admin = await requireAdmin();
  const [client] = await db.insert(clientsTable).values({
    ...data,
    status: 'lead',
  }).returning();

  await logActivity(admin.id, 'Created client', 'client', client.id);
  revalidatePath('/admin/clients');
  revalidatePath('/admin');
  return client;
}

export async function updateClientStatus(id: string, status: 'lead' | 'onboarding' | 'active' | 'inactive' | 'churned') {
  const admin = await requireAdmin();
  await db.update(clientsTable)
    .set({ status, updated_at: new Date() })
    .where(eq(clientsTable.id, id));

  await logActivity(admin.id, `Updated client status to ${status}`, 'client', id);
  revalidatePath('/admin/clients');
}

// ─── Project Actions ───────────────────────────────────────────────────────────

export async function createProject(data: {
  name: string;
  description?: string;
  client_id?: string;
  budget?: number;
  tech_stack?: string;
  due_date?: Date;
}) {
  const admin = await requireAdmin();
  const [project] = await db.insert(projectsTable).values({
    ...data,
    status: 'planning',
    progress: 0,
  }).returning();

  await logActivity(admin.id, 'Created project', 'project', project.id);

  // Send notification
  try {
    await db.insert(notificationsTable).values({
      user_id: admin.id,
      type: 'project',
      title: `New project: ${data.name}`,
      message: `Project "${data.name}" has been created and is in planning stage.`,
      action_url: '/admin/projects',
    });
  } catch { /* table may not exist */ }

  revalidatePath('/admin/projects');
  revalidatePath('/admin');
  return project;
}

export async function updateProjectStatus(id: string, status: 'planning' | 'in_progress' | 'review' | 'deployed' | 'completed' | 'on_hold' | 'cancelled') {
  const admin = await requireAdmin();
  const updateData: any = { status, updated_at: new Date() };
  if (status === 'completed') updateData.completed_date = new Date();

  await db.update(projectsTable).set(updateData).where(eq(projectsTable.id, id));
  await logActivity(admin.id, `Updated project status to ${status}`, 'project', id);
  revalidatePath('/admin/projects');
}

export async function updateProjectProgress(id: string, progress: number) {
  const admin = await requireAdmin();
  await db.update(projectsTable)
    .set({ progress: Math.min(Math.max(progress, 0), 100), updated_at: new Date() })
    .where(eq(projectsTable.id, id));

  await logActivity(admin.id, `Updated project progress to ${progress}%`, 'project', id);
  revalidatePath('/admin/projects');
}

// ─── Task Actions ──────────────────────────────────────────────────────────────

export async function createTask(data: {
  project_id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  due_date?: Date;
}) {
  const admin = await requireAdmin();
  const [task] = await db.insert(projectTasksTable).values({
    ...data,
    status: 'todo',
    priority: data.priority || 'medium',
  }).returning();

  await logActivity(admin.id, 'Created task', 'task', task.id);
  revalidatePath('/admin/projects');
  return task;
}

export async function updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'review' | 'done') {
  const admin = await requireAdmin();
  const updateData: any = { status };
  if (status === 'done') updateData.completed_at = new Date();

  await db.update(projectTasksTable).set(updateData).where(eq(projectTasksTable.id, id));
  await logActivity(admin.id, `Updated task status to ${status}`, 'task', id);
  revalidatePath('/admin/projects');
}

// ─── Notification Actions ──────────────────────────────────────────────────────

export async function markNotificationRead(id: string) {
  await requireAdmin();
  await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, id));
  revalidatePath('/admin/notifications');
}

export async function markAllNotificationsRead() {
  const admin = await requireAdmin();
  await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.user_id, admin.id));
  revalidatePath('/admin/notifications');
}

// ─── User Actions ──────────────────────────────────────────────────────────────

export async function updateUserRole(userId: string, role: string) {
  const admin = await requireAdmin();
  if (admin.dbRole !== 'super_admin') throw new Error('Only super admins can change roles');

  await db.update(usersTable).set({ role: role as any }).where(eq(usersTable.id, userId));
  await logActivity(admin.id, `Updated user role to ${role}`, 'user', userId);
  revalidatePath('/admin/users');
}

// ─── Search Actions ────────────────────────────────────────────────────────────

export async function searchAdminEntities(query: string) {
  if (!query || query.length < 2) return [];
  await requireAdmin();

  const searchTerm = `%${query}%`;

  // Search inquiries
  const inquiries = await db
    .select({ id: projectEnquiriesTable.id, name: projectEnquiriesTable.name, type: sql<string>`'inquiry'` })
    .from(projectEnquiriesTable)
    .where(or(
      ilike(projectEnquiriesTable.name, searchTerm),
      ilike(projectEnquiriesTable.email, searchTerm),
      ilike(projectEnquiriesTable.description, searchTerm)
    ))
    .limit(5);

  // Search clients
  const clients = await db
    .select({ id: clientsTable.id, name: clientsTable.name, type: sql<string>`'client'` })
    .from(clientsTable)
    .where(or(
      ilike(clientsTable.name, searchTerm),
      ilike(clientsTable.email, searchTerm),
      ilike(clientsTable.company, searchTerm)
    ))
    .limit(5);

  // Search projects
  const projects = await db
    .select({ id: projectsTable.id, name: projectsTable.name, type: sql<string>`'project'` })
    .from(projectsTable)
    .where(or(
      ilike(projectsTable.name, searchTerm),
      ilike(projectsTable.description, searchTerm)
    ))
    .limit(5);

  return [...inquiries, ...clients, ...projects];
}

// ─── Content / CMS Actions ───────────────────────────────────────────────────

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
}) {
  const admin = await requireAdmin();
  const [post] = await db.insert(postsTable).values({
    ...data,
    author_id: admin.id,
    status: 'draft',
  }).returning();

  await logActivity(admin.id, 'Created blog post', 'post', post.id);
  revalidatePath('/admin/content');
  return post;
}

export async function updatePost(id: string, data: Partial<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
}>) {
  const admin = await requireAdmin();
  const updateData: any = { ...data, updated_at: new Date() };
  if (data.status === 'published') updateData.published_at = new Date();

  await db.update(postsTable).set(updateData).where(eq(postsTable.id, id));
  await logActivity(admin.id, `Updated post: ${data.title || id}`, 'post', id);
  revalidatePath('/admin/content');
  revalidatePath(`/admin/content/${id}`);
}

export async function deletePost(id: string) {
  const admin = await requireAdmin();
  await db.delete(postsTable).where(eq(postsTable.id, id));
  await logActivity(admin.id, 'Deleted post', 'post', id);
  revalidatePath('/admin/content');
}

// ─── Media Actions ────────────────────────────────────────────────────────────

export async function addMediaAsset(data: {
  name: string;
  url: string;
  size?: number;
  type?: string;
  project_id?: string;
}) {
  const admin = await requireAdmin();
  const [asset] = await db.insert(mediaAssetsTable).values({
    ...data,
    uploaded_by: admin.id,
  }).returning();

  await logActivity(admin.id, 'Uploaded media asset', 'media', asset.id);
  revalidatePath('/admin/media');
  return asset;
}

export async function deleteMediaAsset(id: string) {
  const admin = await requireAdmin();
  await db.delete(mediaAssetsTable).where(eq(mediaAssetsTable.id, id));
  await logActivity(admin.id, 'Deleted media asset', 'media', id);
  revalidatePath('/admin/media');
}

// ─── Settings Actions ─────────────────────────────────────────────────────────

export async function getSiteSettings() {
  await requireAdmin();
  try {
    const [settings] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 'global'));
    if (!settings) {
      const [newSettings] = await db.insert(siteSettingsTable).values({
        id: 'global',
        site_name: 'RactroTech',
      }).returning();
      return newSettings;
    }
    return settings;
  } catch {
    return null;
  }
}

export async function updateSiteSettings(data: any) {
  await requireAdmin();
  await db.update(siteSettingsTable).set({ ...data, updated_at: new Date() }).where(eq(siteSettingsTable.id, 'global'));
  revalidatePath('/admin/settings');
}

// ─── Audit Actions ────────────────────────────────────────────────────────────

export async function getActivityLogs(limit = 100) {
  await requireAdmin();
  return await db.select().from(activityLogsTable).orderBy(desc(activityLogsTable.created_at)).limit(limit);
}
