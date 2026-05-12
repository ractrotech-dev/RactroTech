'use client';

interface MiniStatProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
}

export default function MiniStat({ icon, value, label, color }: MiniStatProps) {
  return (
    <div className="flex items-center gap-3 border-4 border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div
        className={`flex h-9 w-9 items-center justify-center border-2 border-black ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-wider text-black/40">{label}</p>
      </div>
    </div>
  );
}
