import { WorkspaceScreen } from "@/features/workspace/components/workspace-screen";

const sections = ["clients", "cases", "tasks", "calendar", "documents", "finance", "settings"] as const;

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const activeSection = sections.includes(section as (typeof sections)[number]) ? section as (typeof sections)[number] : "clients";
  return <WorkspaceScreen section={activeSection} />;
}
