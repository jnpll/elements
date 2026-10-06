import { Playground } from "@/components/playground";
import { isComponentId } from "@/lib/catalog";

export const metadata = { title: "Playground" };

export default async function Page({ searchParams }: { searchParams: Promise<{ component?: string }> }) {
  const { component } = await searchParams;
  return <Playground key={component} initialId={component && isComponentId(component) ? component : "button"} />;
}
