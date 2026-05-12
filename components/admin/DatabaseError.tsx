'use client';

import { AlertTriangle, RefreshCw, Database } from "lucide-react";

export default function DatabaseError({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center border-4 border-black bg-red-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <Database size={40} className="text-white" />
      </div>
      
      <h2 className="text-2xl font-black uppercase tracking-tight text-black">
        Database Connection Failed
      </h2>
      
      <div className="mt-4 max-w-md border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start gap-3 text-left">
          <AlertTriangle className="mt-1 shrink-0 text-red-600" size={20} />
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-black/40">Error Detail</p>
            <p className="mt-1 text-xs font-bold leading-relaxed text-black/70">
              {message || "The application could not establish a connection to the database. This usually happens if the DATABASE_URL is missing or the database server is offline."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 border-4 border-black bg-yellow-400 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
        >
          <RefreshCw size={14} /> Retry Connection
        </button>
        <a 
          href="https://supabase.com/dashboard" 
          target="_blank" 
          className="flex items-center gap-2 border-4 border-black bg-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
        >
          Open Supabase Dashboard
        </a>
      </div>

      <p className="mt-8 text-[9px] font-bold uppercase tracking-widest text-black/30">
        Check your .env file and ensure DATABASE_URL is set correctly.
      </p>
    </div>
  );
}
