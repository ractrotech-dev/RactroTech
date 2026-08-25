import { HOW_TO_GET_CUSTOMERS_COPY } from '@/utils/clients/uk-playbook';

export function HowToGetCustomersPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h2 className="text-base font-semibold text-foreground">
        {HOW_TO_GET_CUSTOMERS_COPY.headline}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {HOW_TO_GET_CUSTOMERS_COPY.intro}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        {HOW_TO_GET_CUSTOMERS_COPY.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
