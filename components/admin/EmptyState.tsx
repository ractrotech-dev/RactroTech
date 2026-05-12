import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
      <div className="flex h-14 w-14 items-center justify-center border-4 border-black/10 bg-gray-50">
        <Icon size={24} className="text-black/15" />
      </div>
      <p className="text-sm font-black uppercase tracking-wider text-black/30">{title}</p>
      {description && (
        <p className="max-w-sm text-center text-[11px] font-semibold text-black/20">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
