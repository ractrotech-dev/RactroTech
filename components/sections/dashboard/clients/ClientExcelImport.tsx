'use client';

import { useRef, useState, useTransition } from 'react';
import { Download, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { insertClientsIntoDatabase } from '@/utils/clients/bulk-insert';
import { downloadClientTemplate, parseClientSpreadsheet } from '@/utils/clients/excel';
import { createClient } from '@/utils/supabase/client';

type ClientExcelImportProps = {
  onImported: () => void;
  onFeedback: (message: string, success: boolean) => void;
};

export function ClientExcelImport({
  onImported,
  onFeedback,
}: ClientExcelImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDownload = () => {
    downloadClientTemplate();
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['xlsx', 'xls', 'csv'].includes(ext)) {
      onFeedback('Use an Excel file (.xlsx, .xls) or .csv from the template.', false);
      return;
    }

    setFileName(file.name);
    startTransition(async () => {
      const parsed = await parseClientSpreadsheet(file);
      if (!parsed.ok) {
        onFeedback(parsed.error, false);
        setFileName(null);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        onFeedback('You must be signed in to import clients.', false);
        setFileName(null);
        return;
      }

      const result = await insertClientsIntoDatabase(
        supabase,
        user.id,
        parsed.rows,
      );

      onFeedback(result.message, result.success);

      if (result.success) {
        await onImported();
        setFileName(null);
      } else {
        setFileName(null);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-4">
      <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
        <Download className="mr-1.5 h-4 w-4" />
        Download sample Excel
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />
      <Button
        type="button"
        variant="default"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-1.5 h-4 w-4" />
        {isPending ? 'Saving to database…' : 'Upload Excel'}
      </Button>
      {fileName && !isPending && (
        <span className="text-xs text-muted-foreground">{fileName}</span>
      )}
      <p className="w-full text-xs text-muted-foreground">
        Rows are written to your Supabase <strong>clients</strong> table (email
        required, phone optional). Run migrations <code className="text-[10px]">0008</code>{' '}
        and <code className="text-[10px]">0012</code> if import fails on permissions.
      </p>
    </div>
  );
}
