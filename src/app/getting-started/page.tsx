import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata = { title: "Installation" };

export default function Page() {
  return <article className="prose-page"><div className="breadcrumb">Start here <span>/</span> Installation</div><h1>Installation</h1><p className="intro">One package. A shared foundation for your apps.</p>
    <section className="doc-section"><h2>1. Authenticate</h2><p className="body-copy">Configure the account registry and sign in with a classic GitHub token that has read:packages. Keep credentials in your user-level npm configuration.</p><CodeBlock label="shell" code={'npm config set @jnpll:registry https://npm.pkg.github.com --location=project\nnpm login --scope=@jnpll --auth-type=legacy --registry=https://npm.pkg.github.com'} /></section>
    <section className="doc-section"><h2>2. Add the dependency</h2><p className="body-copy">Version 0.2.0 is available from GitHub Packages. React 19 and Tailwind CSS 4 are required. No local library checkout is needed.</p><CodeBlock label="shell" code={'npm install @jnpll/elements-ui@0.2.0'} /></section>
    <section className="doc-section"><h2>3. Connect the theme</h2><p className="body-copy">Import the stylesheet in your global CSS, after Tailwind. Adjust the source path relative to that file so Tailwind scans the package classes.</p><CodeBlock label="globals.css" code={'@import "tailwindcss";\n@import "@jnpll/elements-ui/styles.css";\n\n@source "../../node_modules/@jnpll/elements-ui/dist";'} /></section>
    <section className="doc-section"><h2>4. Import a component</h2><CodeBlock code={'import { Button } from "@jnpll/elements-ui/button";\n\nexport function SaveAction() {\n  return <Button>Save changes</Button>;\n}'} /><p className="body-copy">Import components through their package exports. For Next.js, place interactive examples in a client component. Add the dark class to the document element for dark mode.</p></section>
    <Link className="text-link" href="/components/button">Explore Button</Link>
  </article>;
}
