import fs from "node:fs/promises";
import path from "node:path";

// Adapt official Base UI examples to consume this package's public exports.
const componentDir = path.resolve("node_modules/@jnpll/elements-ui/dist/components");
const original = new Set(["badge", "button", "card", "glass-panel", "scroll-area", "separator", "tabs", "tooltip"]);
const ids = (await fs.readdir(componentDir)).filter((f) => f.endsWith(".js")).map((f) => f.slice(0, -3)).filter((id) => !original.has(id)).sort();
const root = "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/examples/base/";
const destination = "src/components/examples";
await fs.mkdir(destination, { recursive: true });
const imports = [], entries = [], metadata = [];
const groups = {
  Forms: ["checkbox", "combobox", "field", "input", "input-group", "input-otp", "label", "native-select", "radio-group", "select", "slider", "switch", "textarea"],
  Overlays: ["alert-dialog", "context-menu", "dialog", "drawer", "dropdown-menu", "hover-card", "menubar", "popover", "sheet"],
  Navigation: ["breadcrumb", "command", "navigation-menu", "pagination", "sidebar"],
  Feedback: ["alert", "empty", "progress", "skeleton", "sonner", "spinner"],
  Actions: ["button-group", "toggle", "toggle-group"],
};
const descriptions = {
  accordion: "Collapsible sections for related questions and content.",
  "alert-dialog": "An explicit confirmation before a consequential action.",
  alert: "A message that keeps important context visible.",
  "aspect-ratio": "A stable frame for images and other media.",
  avatar: "An image or fallback that identifies a person.",
  breadcrumb: "The path to the current view, with links to its ancestors.",
  "button-group": "Related actions presented as a connected group.",
  calendar: "A date selection surface powered by React Day Picker.",
  carousel: "A swipeable sequence powered by Embla Carousel.",
  chart: "Responsive data visualization powered by Recharts.",
  checkbox: "An independent choice with checked and indeterminate states.",
  collapsible: "Content that can be expanded and collapsed.",
  combobox: "Search and select from a list of choices.",
  command: "Searchable commands, grouped and keyboard accessible.",
  "context-menu": "Actions attached to a right-click or long-press target.",
  dialog: "A focused, modal conversation with the user.",
  drawer: "A dismissible surface that slides in from an edge.",
  "dropdown-menu": "A compact menu of actions and choices.",
  empty: "A composed state for when there is nothing to show yet.",
  field: "Labels, descriptions, and validation around a form control.",
  "hover-card": "A rich preview available on hover or focus.",
  "input-group": "An input with connected icons, text, or actions.",
  "input-otp": "A grouped input for one-time verification codes.",
  input: "A single-line text input with consistent states.",
  item: "A repeated content item with media, metadata, and actions.",
  kbd: "A compact visual representation of keyboard keys.",
  label: "An accessible name connected to a form control.",
  menubar: "A persistent row of application menus.",
  "native-select": "A styled native select element.",
  "navigation-menu": "Primary navigation with optional expandable content.",
  pagination: "Navigation through a sequence of pages.",
  popover: "A small anchored surface for contextual content.",
  progress: "Completion of a task, including indeterminate states.",
  "radio-group": "One selection from a set of related choices.",
  resizable: "Panels that can be resized with a pointer or keyboard.",
  select: "An accessible picker with a styled options popup.",
  sheet: "A dialog surface anchored to the edge of the viewport.",
  sidebar: "A responsive application sidebar with collapsible navigation.",
  skeleton: "A placeholder that preserves layout while content loads.",
  slider: "A numeric value or range, adjusted along a track.",
  sonner: "Transient notifications powered by Sonner.",
  spinner: "A compact indicator that a task is in progress.",
  switch: "An immediate on or off preference.",
  table: "Semantic table elements for structured information.",
  textarea: "A multiline text input with consistent focus states.",
  "toggle-group": "A set of related pressed-state controls.",
  toggle: "A button that represents a pressed or unpressed state.",
};
const props = (id) => {
  const common = [{ name: "className", type: "string", default: "-", description: "Additional classes, merged with the component styles." }];
  if (["input", "textarea", "input-otp", "native-select"].includes(id)) common.unshift({ name: "disabled", type: "boolean", default: "false", description: "Disables the control." }, { name: "value / defaultValue", type: "string", default: "-", description: "Controlled or initial input value." });
  else if (["checkbox", "switch"].includes(id)) common.unshift({ name: "checked / defaultChecked", type: "boolean", default: "false", description: "Controlled or initial checked state." }, { name: "onCheckedChange", type: "function", default: "-", description: "Receives checked-state changes." });
  else if (["dialog", "alert-dialog", "drawer", "sheet", "popover", "dropdown-menu", "context-menu", "hover-card", "collapsible"].includes(id)) common.unshift({ name: "open / defaultOpen", type: "boolean", default: "false", description: "Controlled or initial open state on the root." }, { name: "onOpenChange", type: "function", default: "-", description: "Receives open-state changes." });
  else if (id === "calendar") common.unshift({ name: "mode", type: '"single" | "multiple" | "range"', default: "-", description: "Date selection mode." }, { name: "selected", type: "Date | Date[] | DateRange", default: "-", description: "Selection, depending on the mode." });
  else if (id === "chart") common.unshift({ name: "config", type: "ChartConfig", default: "-", description: "Series labels, colors, and optional icons." });
  else if (id === "progress" || id === "slider") common.unshift({ name: "value", type: id === "progress" ? "number | null" : "number | number[]", default: "-", description: "Controlled numeric value." }, { name: "max", type: "number", default: "100", description: "Upper bound." });
  else if (id === "aspect-ratio") common.unshift({ name: "ratio", type: "number", default: "1", description: "Width divided by height." });
  else common.unshift({ name: "children", type: "ReactNode", default: "-", description: "Component content and composition slots." });
  return common;
};

for (const id of ids) {
  const name = id === "sonner" ? "Toast" : id.split("-").map((s) => s === "otp" ? "OTP" : s === "kbd" ? "Keyboard" : s[0].toUpperCase() + s.slice(1)).join(" ");
  const variants = [], codes = [];
  for (const suffix of ["demo", "disabled"]) {
    if (id === "sonner") break;
    const response = await fetch(`${root}${id}-${suffix}.tsx`, { signal: AbortSignal.timeout(20000) });
    if (response.status === 404 && suffix === "disabled") continue;
    if (!response.ok) throw new Error(`${id}: ${response.status}`);
    let source = await response.text();
    source = source.replace(/@\/styles\/base-[^/]+\/ui\//g, "@jnpll/elements-ui/")
      .replace(/@\/registry\/new-york-v4\/ui\//g, "@jnpll/elements-ui/")
      .replace(/from "sonner"/g, 'from "@jnpll/elements-ui/sonner"')
      .replace(/import \{ IconFolderCode \} from "@tabler\/icons-react"/g, 'import { FolderCode as IconFolderCode } from "lucide-react"')
      .replace(/@\/components\/ui\//g, "@jnpll/elements-ui/")
      .replace(/@\/styles\/base-nova\/hooks\//g, "@jnpll/elements-ui/hooks/")
      .replace(/@\/hooks\//g, "@jnpll/elements-ui/hooks/")
      .replace(/(?:@\/lib\/utils|@\/styles\/base-nova\/lib\/utils|(?<=from ")cn)(?=")/g, "@jnpll/elements-ui/utils");
    if (!source.startsWith('"use client"')) source = '"use client"\n\n' + source;
    if (id === "aspect-ratio") source = '"use client";\nimport { AspectRatio } from "@jnpll/elements-ui/aspect-ratio";\nexport default function AspectRatioDemo() { return <AspectRatio ratio={16 / 9} className="w-full max-w-sm"><img src="/samples/workspace.webp" alt="MacBook Pro on a workspace" className="size-full rounded-md object-contain bg-white" /></AspectRatio>; }\n';
    source = source.replaceAll('/avatars/shadcn.jpg', 'https://github.com/shadcn.png');
    if (id === "chart") source = source.replaceAll("labelFormatter={(value) => {", 'labelFormatter={(value) => {\n                    if (typeof value !== "string" && typeof value !== "number") return value');
    source = source.replaceAll('/docs/primitives/typography', '/tokens')
      .replaceAll('/docs/primitives/', '/components/')
      .replaceAll('/docs/installation', '/getting-started')
      .replaceAll('"/docs"', '"/getting-started"');
    if (!/export default/.test(source)) {
      const name = source.match(/export function (\w+)/)?.[1];
      if (!name) throw new Error(`Missing example export: ${id}-${suffix}`);
      source += `\nexport default ${name};\n`;
    }
    const variable = `${id.replaceAll("-", "_")}_${suffix}`;
    const filename = `${id}-${suffix}`;
    await fs.writeFile(`${destination}/${filename}.tsx`, source);
    imports.push(`import ${variable} from "@/components/examples/${filename}";`);
    variants.push(`{ name: ${JSON.stringify(suffix === "demo" ? "Default" : "Disabled")}, component: ${variable}, code: ${JSON.stringify(source)} }`);
    codes.push(source);
  }
  if (id === "sonner") {
    const source = '"use client";\n\nimport { Button } from "@jnpll/elements-ui/button";\nimport { Toaster, toast } from "@jnpll/elements-ui/sonner";\n\nexport default function ToastDemo() {\n  return <><Toaster /><Button onClick={() => toast.success("Changes saved", { description: "Your workspace is up to date." })}>Show notification</Button></>;\n}\n';
    await fs.writeFile(`${destination}/sonner-demo.tsx`, source);
    imports.push('import sonner_demo from "@/components/examples/sonner-demo";');
    variants.push(`{ name: "Default", component: sonner_demo, code: ${JSON.stringify(source)} }`);
    codes.push(source);
  }
  entries.push(`${JSON.stringify(id)}: [${variants.join(", ")}]`);
  const group = Object.entries(groups).find(([, values]) => values.includes(id))?.[0] ?? "Display";
  metadata.push({ id, name, description: descriptions[id], group, props: props(id), note: "Import the composition slots shown in the example. Keep labels and descriptions meaningful; interactive primitives provide keyboard and focus behavior. See the source for the complete typed API.", examples: variants.length, codes });
  console.log(`Added ${id} examples`);
}
await fs.writeFile("src/lib/extra-catalog.ts", `export const extraIds = ${JSON.stringify(ids)} as const;\nexport type ExtraComponentId = typeof extraIds[number];\nexport const extraCatalog = ${JSON.stringify(metadata, null, 2)};\n`);
await fs.writeFile("src/lib/extra-examples.tsx", '"use client";\n\n' + imports.join("\n") + '\n\nexport const extraExamples = {\n' + entries.join(",\n") + '\n};\n');
