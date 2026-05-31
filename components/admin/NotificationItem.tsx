'use client';

import { useTransition } from 'react';
import { markNotificationRead } from '@/app/admin/actions';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string | null;
    read: boolean;
    created_at: Date | null;
    action_url: string | null;
  };
  iconMap: Record<string, any>;
  colorMap: Record<string, string>;
}

export default function NotificationItem({ notification, iconMap, colorMap }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = () => {
    if (notification.read) return;
    startTransition(async () => {
      await markNotificationRead(notification.id);
    });
  };

  const Icon = iconMap[notification.type] || Bell;
  const color = colorMap[notification.type] || 'bg-gray-400';

  return (
    <motion.div
      layout
      onClick={handleMarkRead}
      className={`flex items-start gap-4 px-5 py-5 transition-all cursor-pointer group ${
        !notification.read ? 'bg-yellow-50/50 hover:bg-yellow-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black ${color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all`}>
        <Icon size={16} className="text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${!notification.read ? 'font-black' : 'font-bold text-black/60'}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-400 border-2 border-black animate-pulse" />
          )}
        </div>
        <p className="mt-1 text-xs font-semibold text-black/40 leading-relaxed">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[9px] font-black tracking-[0.2em] text-black/25">
            {notification.created_at ? new Date(notification.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </span>
          {notification.action_url && (
            <a
              href={notification.action_url}
              onClick={(e) => e.stopPropagation()}
              className="text-[9px] font-black tracking-widest text-blue-600 hover:underline"
            >
              View Details →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
