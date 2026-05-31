import { getSiteSettings } from "@/app/admin/actions";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings | Admin | RactroTech", description: "Admin settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Site Settings" 
        subtitle="Manage your platform configuration and global defaults" 
        backHref="/admin" 
      />

      {settings ? (
        <SettingsForm settings={settings as any} />
      ) : (
        <div className="border-4 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black tracking-wider text-red-500">
            Error loading settings. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
