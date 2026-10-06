import { notFound } from "next/navigation";
import { catalog, isComponentId } from "@/lib/catalog";
import { ComponentDoc } from "@/components/component-doc";

export function generateStaticParams() { return catalog.map(({ id }) => ({ slug: id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: catalog.find(({ id }) => id === slug)?.name ?? "Component" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isComponentId(slug)) notFound();
  return <ComponentDoc key={slug} id={slug} />;
}
