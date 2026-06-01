import { constructMetadata, sitePath } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Start a Project",
  description:
    "Ready to build something amazing? Start your web development project with Ractrotech today.",
  canonicalUrl: sitePath("/start-project"),
});

export default function StartProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
