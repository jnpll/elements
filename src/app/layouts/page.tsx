import { redirect } from "next/navigation";
import { isLayoutId } from "@/lib/layouts";

export const metadata = { title: "Layouts" };
export default async function Page({ searchParams }: { searchParams: Promise<{ layout?: string }> }) {
  const { layout } = await searchParams;
  redirect(`/playground?layout=${isLayoutId(layout) ? layout : "overview"}`);
}
