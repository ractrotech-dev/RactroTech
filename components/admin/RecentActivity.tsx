'use client';

import { motion } from 'framer-motion';
import { Inbox, UserPlus, FolderPlus, AlertCircle, UserCircle, FileText } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'inquiry' | 'user' | 'project' | 'alert' | 'client' | 'system';
  title: string;
  description: string;
  time: string;
}

const iconMap = {
  inquiry: Inbox,
  user: UserPlus,
  project: FolderPlus,
  alert: AlertCircle,
  client: UserCircle,
  system: FileText,
};

const colorMap = {
  inquiry: 'bg-blue-400',
  user: 'bg-emerald-400',
  project: 'bg-yellow-400',
  alert: 'bg-red-400',
  client: 'bg-purple-400',
  system: 'bg-gray-300',
};

interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-4 border-black px-5 py-3">
        <h3 className="text-xs font-black tracking-[0.2em]">Recent Activity</h3>
      </div>
      <div className="divide-y-2 divide-black/5">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm font-bold text-black/30">
            No recent activity
          </div>
        ) : (
          items.map((item, i) => {
            const Icon = iconMap[item.type] ?? FileText;
            const colorClass = colorMap[item.type] ?? 'bg-gray-400';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-black ${colorClass}`}
                >
                  <Icon size={13} className="text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{item.title}</p>
                  <p className="truncate text-[10px] font-semibold text-black/50">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-[9px] font-bold tracking-wider text-black/30">
                  {item.time}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
