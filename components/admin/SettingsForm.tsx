'use client';

import { useState, useTransition } from 'react';
import { updateSiteSettings } from '@/app/admin/actions';
import { Save, Globe, Shield, Mail, Share2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsFormProps {
  settings: {
    site_name: string;
    site_description: string | null;
    maintenance_mode: boolean;
    contact_email: string | null;
    footer_text: string | null;
    social_links: string | null;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateSiteSettings(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="space-y-6">
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-blue-400">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">General Configuration</h3>
                <p className="text-[10px] font-bold text-black/40">Core identity of the platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Site Name</label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full border-2 border-black px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Site Description</label>
                <textarea
                  value={formData.site_description || ''}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-black px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-red-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">System Status</h3>
                <p className="text-[10px] font-bold text-black/40">Maintenance and availability</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-2 border-black p-4 bg-gray-50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider">Maintenance Mode</p>
                <p className="text-[9px] font-bold text-black/40">If enabled, the public site will show a &quot;Coming Soon&quot; page.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, maintenance_mode: !formData.maintenance_mode })}
                className={`h-6 w-12 border-2 border-black p-0.5 transition-colors ${formData.maintenance_mode ? 'bg-yellow-400' : 'bg-gray-200'}`}
              >
                <div className={`h-4 w-4 border-2 border-black bg-white transition-transform ${formData.maintenance_mode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="space-y-6">
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-emerald-400">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Contact & Support</h3>
                <p className="text-[10px] font-bold text-black/40">Public facing contact info</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Support Email</label>
                <input
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full border-2 border-black px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Footer Text</label>
                <input
                  type="text"
                  value={formData.footer_text || ''}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  className="w-full border-2 border-black px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-purple-400">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Social Connectivity</h3>
                <p className="text-[10px] font-bold text-black/40">Manage your online presence</p>
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center border-2 border-black bg-gray-50 p-3 text-[10px] font-bold text-black/40 italic">
                 <Info size={14} className="mr-2" />
                 Social link mapping is currently managed via global constants.
               </div>
               <button type="button" className="w-full border-2 border-black py-2 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                 Configure Integrations
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 border-4 border-black bg-yellow-400 px-8 py-3 text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        >
          <Save size={16} />
          {isPending ? 'Updating Settings...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
}
