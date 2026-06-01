import Script from "next/script";

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="lazyOnload" />
      {children}
    </>
  );
}
