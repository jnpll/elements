import { redirect } from "next/navigation";
import { LayoutGallery } from "@/components/layout-gallery";
import { isLayoutId } from "@/lib/layouts";
import { isComponentId } from "@/lib/catalog";

export const metadata = { title: "Playground" };

export default async function Page({ searchParams }: { searchParams: Promise<{ component?: string; layout?: string }> }) {
  const { component, layout } = await searchParams;
  if (component && isComponentId(component)) redirect(`/components/${component}`);
  return <LayoutGallery key={layout} initialLayout={isLayoutId(layout) ? layout : "overview"} />;
}
