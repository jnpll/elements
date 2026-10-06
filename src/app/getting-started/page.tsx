import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata = { title: "Installation" };

export default function Page() {
  return <article className="prose-page"><div className="breadcrumb">Start here <span>/</span> Installation</div><h1>Installation</h1><p className="intro">One package. A shared foundation for your apps.</p>
    <section className="doc-section"><h2>1. Authenticate</h2><p className="body-copy">GitHub Packages requires authentication even for public npm packages. Create a classic GitHub token with read:packages using an account that can access the package. Configure the registry with an environment-variable placeholder, never the token itself.</p><CodeBlock label=".npmrc" code={'@jnpll:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}'} /><p className="body-copy">Supply NODE_AUTH_TOKEN in your shell before installing. This Bash/zsh prompt keeps the token out of shell history and terminal output. npm does not load Next.js .env.local files.</p><CodeBlock label="shell" code={'printf \'GitHub package token: \'\nread -rs NODE_AUTH_TOKEN\nprintf \'\\n\'\nexport NODE_AUTH_TOKEN'} /></section>
    <section className="doc-section"><h2>2. Add the dependency</h2><p className="body-copy">Version 0.2.0 is available from GitHub Packages. React 19 and Tailwind CSS 4 are required. No local library checkout is needed.</p><CodeBlock label="shell" code={'npm install @jnpll/elements-ui@0.2.0'} /></section>
    <section className="doc-section"><h2>3. Connect the theme</h2><p className="body-copy">Import the stylesheet in your global CSS, after Tailwind. Adjust the source path relative to that file so Tailwind scans the package classes.</p><CodeBlock label="globals.css" code={'@import "tailwindcss";\n@import "@jnpll/elements-ui/styles.css";\n\n@source "../../node_modules/@jnpll/elements-ui/dist";'} /></section>
    <section className="doc-section"><h2>4. Import a component</h2><CodeBlock code={'import { Button } from "@jnpll/elements-ui/button";\n\nexport function SaveAction() {\n  return <Button>Save changes</Button>;\n}'} /><p className="body-copy">Import components through their package exports. For Next.js, place interactive examples in a client component. Add the dark class to the document element for dark mode.</p></section>
    <section className="doc-section"><h2>Deploy to Vercel</h2><p className="body-copy">Create a dedicated classic GitHub token with only read:packages. In your Vercel project settings, add NODE_AUTH_TOKEN as a sensitive environment variable for Production and Preview, then redeploy. Keep the token out of source control and never prefix it with NEXT_PUBLIC_. The .npmrc above authenticates package installation during the build.</p></section>
    <Link className="text-link" href="/components/button">Explore Button</Link>
  </article>;
}
