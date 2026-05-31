import { RetroFooter } from '@/components/retro-footer';
import { RetroHeader } from '@/components/retro-header';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="journal-shell flex min-h-screen flex-col text-black">
      <RetroHeader />
      <div className="flex-1">{children}</div>
      <RetroFooter />
    </div>
  );
}
