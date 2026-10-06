import { extraCatalog, extraIds } from "./extra-catalog";
export const componentIds = ["button", "badge", "card", "glass-panel", "tabs", "tooltip", "separator", "scroll-area", ...extraIds] as const;
export type ComponentId = typeof componentIds[number];
export type Options = {
  text: string;
  variant: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  disabled: boolean;
  icon: boolean;
  strong: boolean;
  ring: boolean;
  orientation: "horizontal" | "vertical";
  tabVariant: "default" | "line";
  side: "top" | "right" | "bottom" | "left";
  delay: number;
  example: number;
};
export type PropRow = { name: string; type: string; default: string; description: string };
export type ComponentInfo = { id: ComponentId; name: string; description: string; group: string; props: PropRow[]; note: string };
const prop = (name: string, type: string, value: string, description: string): PropRow => ({ name, type, default: value, description });
export const catalog: ComponentInfo[] = [
  { id: "button", name: "Button", group: "Actions", description: "A familiar action, with a considered weight and clear states.", note: "Use a verb for the label. Icon-only buttons need an accessible name. Disabled buttons remain visible but cannot be activated. When composing with a link, set nativeButton={false}.", props: [prop("variant", '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"', '"default"', "Visual emphasis and intent."), prop("size", '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', '"default"', "Height, spacing, and icon dimensions."), prop("disabled", "boolean", "false", "Prevents activation."), prop("nativeButton", "boolean", "true", "Set to false when rendering a link or another non-button element."), prop("render", "ReactElement | function", "button", "Replaces the underlying element via Base UI composition.")] },
  { id: "badge", name: "Badge", group: "Display", description: "A compact label for a status, category, or small piece of metadata.", note: "Use short, meaningful labels. Badge styling alone does not convey interactive behavior; compose with a link when navigation is intended.", props: [prop("variant", '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"', '"default"', "Visual emphasis."), prop("render", "ReactElement | function", "span", "Composes the badge with another element."), prop("className", "string", "-", "Additional Tailwind classes, merged with defaults.")] },
  { id: "card", name: "Card", group: "Surfaces", description: "A composed surface for a single item, with room for context and actions.", note: "Compose CardHeader, CardTitle, CardDescription, CardContent, and CardFooter inside Card. CardAction provides a header action slot.", props: [prop("size", '"default" | "sm"', '"default"', "Controls internal spacing."), prop("children", "ReactNode", "-", "Card sections and content."), prop("className", "string", "-", "Overrides the default surface styles.")] },
  { id: "glass-panel", name: "Glass Panel", group: "Surfaces", description: "A translucent surface with a subtle blur and optional gradient hairline.", note: "Place GlassPanel over a visible background to see the blur. Keep foreground contrast readable in both light and dark themes.", props: [prop("strong", "boolean", "false", "Increases the surface opacity and blur."), prop("ring", "boolean", "false", "Adds a gradient border overlay."), prop("children", "ReactNode", "-", "Panel content."), prop("className", "string", "-", "Controls padding, width, and additional styling.")] },
  { id: "tabs", name: "Tabs", group: "Navigation", description: "Related views, one at a time, with an accessible tab and panel relationship.", note: "Each TabsTrigger value must match a TabsContent value. Base UI handles focus and arrow-key navigation. TabsList supports default and line variants.", props: [prop("defaultValue", "string | number", "-", "Initial active tab for uncontrolled usage."), prop("value", "string | number", "-", "Active tab for controlled usage."), prop("onValueChange", "function", "-", "Called when the active tab changes."), prop("orientation", '"horizontal" | "vertical"', '"horizontal"', "Layout and keyboard navigation direction."), prop("TabsList.variant", '"default" | "line"', '"default"', "Appearance of the tab list.")] },
  { id: "tooltip", name: "Tooltip", group: "Feedback", description: "A short piece of context, available on hover and keyboard focus.", note: "Wrap tooltips in TooltipProvider. TooltipContent portals the popup and arrow. Keep essential information visible outside the tooltip.", props: [prop("TooltipProvider.delay", "number", "0", "Delay before opening, in milliseconds."), prop("TooltipContent.side", '"top" | "right" | "bottom" | "left"', '"top"', "Preferred popup placement; may change to avoid collisions."), prop("TooltipContent.sideOffset", "number", "4", "Gap from the trigger, in pixels."), prop("TooltipContent.align", '"start" | "center" | "end"', '"center"', "Alignment along the chosen side.")] },
  { id: "separator", name: "Separator", group: "Layout", description: "A quiet divider that gives related content room to breathe.", note: "A vertical separator needs a parent with a defined height. Use the orientation prop to establish the divider's direction.", props: [prop("orientation", '"horizontal" | "vertical"', '"horizontal"', "Direction of the divider."), prop("className", "string", "-", "Controls color, spacing, and dimensions.")] },
  { id: "scroll-area", name: "Scroll Area", group: "Layout", description: "A constrained viewport with a consistent, unobtrusive scrollbar.", note: "Give ScrollArea an explicit height to enable vertical scrolling. The exported ScrollBar supports horizontal orientation for custom compositions.", props: [prop("children", "ReactNode", "-", "Scrollable content."), prop("className", "string", "-", "Defines viewport dimensions and surface styles."), prop("ScrollBar.orientation", '"vertical" | "horizontal"', '"vertical"', "Scrollbar direction; the default ScrollArea includes a vertical bar.")] },
  ...extraCatalog as ComponentInfo[],
];
export function isComponentId(value: string): value is ComponentId { return componentIds.includes(value as ComponentId); }
export function getComponent(id: ComponentId) { return catalog.find((item) => item.id === id)!; }
export function defaultOptions(id: ComponentId): Options {
  const labels: Partial<Record<ComponentId, string>> = { button: "Continue", badge: "In progress", card: "Studio workspace", "glass-panel": "A little clarity", tabs: "Overview", tooltip: "Save to collection", separator: "Details", "scroll-area": "Activity" };
  return { text: labels[id] ?? getComponent(id).name, variant: "default", size: "default", disabled: false, icon: false, strong: false, ring: false, orientation: "horizontal", tabVariant: "default", side: "top", delay: 0, example: 0 };
}
const literal = (value: string) => `{${JSON.stringify(value)}}`;
export function sampleCode(id: ComponentId, o: Options): string {
  const extra = extraCatalog.find((item) => item.id === id);
  if (extra) return extra.codes[o.example] ?? extra.codes[0];
  const components: Partial<Record<ComponentId, string>> = { button: "Button", badge: "Badge", card: "Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter", "glass-panel": "GlassPanel", tabs: "Tabs, TabsList, TabsTrigger, TabsContent", tooltip: "TooltipProvider, Tooltip, TooltipTrigger, TooltipContent", separator: "Separator", "scroll-area": "ScrollArea" };
  const text = literal(o.text);
  let body = "";
  switch (id) {
    case "button": body = `<Button variant="${o.variant}" size="${o.size}"${o.disabled ? " disabled" : ""}${o.size.startsWith("icon") ? ` aria-label=${text}` : ""}>\n  ${o.icon || o.size.startsWith("icon") ? "<ArrowRight />" : ""}${!o.size.startsWith("icon") ? text : ""}\n</Button>`; break;
    case "badge": body = `<Badge variant="${o.variant}">${text}</Badge>`; break;
    case "card": body = `<Card size="${o.size === "sm" ? "sm" : "default"}" className="w-full max-w-sm">\n  <CardHeader>\n    <CardTitle>${text}</CardTitle>\n    <CardDescription>Your space to make something good.</CardDescription>\n  </CardHeader>\n  <CardContent><img src="/samples/workspace.webp" alt="MacBook Pro on a clean workspace" className="mb-4 h-28 w-full rounded-md object-contain bg-white" /><p>Everything you need, in one place.</p></CardContent>\n  <CardFooter><span>Updated just now</span></CardFooter>\n</Card>`; break;
    case "glass-panel": body = `<GlassPanel${o.strong ? " strong" : ""}${o.ring ? " ring" : ""} className="w-full max-w-sm p-6">\n  <h3 className="font-medium">${text}</h3>\n  <p className="mt-2 text-sm text-muted-foreground">A surface that lets the background through.</p>\n</GlassPanel>`; break;
    case "tabs": body = `<Tabs defaultValue="overview" orientation="${o.orientation}">\n  <TabsList variant="${o.tabVariant}">\n    <TabsTrigger value="overview">${text}</TabsTrigger>\n    <TabsTrigger value="activity">Activity</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Your workspace at a glance.</TabsContent>\n  <TabsContent value="activity">Everything is up to date.</TabsContent>\n</Tabs>`; break;
    case "tooltip": body = `<TooltipProvider delay={${o.delay}}>\n  <Tooltip>\n    <TooltipTrigger>Hover or focus</TooltipTrigger>\n    <TooltipContent side="${o.side}">${text}</TooltipContent>\n  </Tooltip>\n</TooltipProvider>`; break;
    case "separator": body = o.orientation === "horizontal" ? `<div className="w-full max-w-sm">\n  <p>${text}</p>\n  <Separator className="my-4" />\n  <p className="text-sm text-muted-foreground">A related section</p>\n</div>` : `<div className="flex h-8 items-center gap-4">\n  <span>${text}</span>\n  <Separator orientation="vertical" />\n  <span>Settings</span>\n</div>`; break;
    case "scroll-area": body = `<ScrollArea className="h-56 w-full max-w-sm rounded-lg border">\n  <div className="p-4">\n    <h3 className="mb-4 font-medium">${text}</h3>\n    {Array.from({ length: 18 }, (_, i) => (\n      <div key={i} className="border-b py-3 text-sm">Workspace update {i + 1}</div>\n    ))}\n  </div>\n</ScrollArea>`; break;
  }
  return `import { ${components[id]} } from "@jnpll/elements-ui/${id}";${id === "button" && (o.icon || o.size.startsWith("icon")) ? '\nimport { ArrowRight } from "lucide-react";' : ""}\n\n${body}`;
}
