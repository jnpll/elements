import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { ThemeProvider } from "@/components/theme-provider";
import { getElementsThemeScript } from "@jnpll/elements-ui/themes";
import { appearanceScript } from "@/lib/appearance";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Elements UI", template: "%s | Elements UI" },
  description: "Component documentation and playground for Elements UI.",
};

const designScript = getElementsThemeScript();

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: appearanceScript + designScript }} /></head><body><ThemeProvider><Shell>{children}</Shell></ThemeProvider></body></html>;
}
