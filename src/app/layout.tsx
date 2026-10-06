import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Elements UI", template: "%s | Elements UI" },
  description: "Component documentation and playground for Elements UI.",
};

const themeScript = `try { const theme = localStorage.getItem('elements-docs-theme'); document.documentElement.classList.toggle('dark', theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)); } catch {}`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><Shell>{children}</Shell></body></html>;
}
