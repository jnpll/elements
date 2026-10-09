# Elements

A Next.js documentation app consuming `@jnpll/elements-ui@0.4.0` from GitHub Packages
through its public exports. No library components are copied into this app.

## Layout previews

`/playground` contains interactive Overview, Board, and Settings presets composed
from the published library components. Theme and palette controls apply to the
whole app, with desktop/mobile preview widths. The samples support project
creation/search, task movement, preference switches, saving, and resetting demo
data. Preset URLs use `?layout=overview`, `?layout=board`, or `?layout=settings`.
Demo edits are local to the gallery session and never sent to a server.

Each component page has its own Preview/Code panel with a toggleable Properties
sidebar, live generated code, reset, and width controls. Properties stay intact
when the sidebar is closed. On narrow screens the sidebar stacks below the preview.

Custom actions use `IconTooltip` for hover and keyboard-focus labels, including
palette selection, GitHub source links, preview controls, and theme tiles. Familiar
browser actions such as Copy may keep native `title` text instead. Every icon-only
control still needs an accessible name, whether or not it has a custom tooltip.
Legacy `/layouts?layout=...` links redirect to the playground, and legacy
`/playground?component=...` links redirect to the component documentation.

Run `npm run test:layouts` with the preview running for browser checks covering
all palettes, appearances, interactions, and mobile layouts.

## Theme collections

The header appearance menu offers Light, Dark, and System. System is the default
and follows live OS appearance changes. Explicit choices persist independently
of the design theme/palette using the existing `elements-docs-theme` storage key.
Run `npm run test:appearance` with the dev server running for browser coverage.

Theme switching now uses the library's `ElementsThemeProvider`,
`useElementsTheme`, `ThemeSelector`, and `getElementsThemeScript`, with all
bundled palettes loaded through `@jnpll/elements-ui/themes.css`. The app keeps
only discovery metadata and compatibility names for existing consumers.
These APIs are included in the pinned 0.4.0 release and available in
registry-only CI and deployment without a sibling library checkout.

App layouts, spacing, sizing, and responsive states use Tailwind CSS 4 utilities
in JSX. Use semantic utilities such as `bg-background`, `text-foreground`, and
`border-border` so every palette works without changing markup. Global CSS is
reserved for base element defaults and specialized effects (tile color mixing,
icon masks, preview textures, and native progress rendering). Named class hooks
remain where theme overrides or browser tests need them; they are not a second
layout styling system. The embedded sample app uses container-query utilities
so its mobile preview responds independently of the browser viewport.

The seven noble-gas tiles select Britanniae palettes in order: Arthur, Guinevere,
Merlin, Mordred, Percival, Lancelot, and Galahad. Alpha remains at Hydrogen.
Selecting a tile applies the design throughout the app without changing light/dark
mode. Selection is validated, persisted in localStorage, and restored before paint.
Collection links open documentation separately from tile selection.

Theme pages include all palette color tokens with light/dark swatches, original
CSS values, and copyable palette CSS. The data is parsed from the installed
library palette stylesheets at build time;
there is no second hand-maintained color catalog. Swatch modes are independent
of the app's appearance, and palette selection updates the displayed tokens.

Britanniae styles and manifest are imported directly from the published package.
Theme icons use typed SVG data URL exports from `@jnpll/elements-ui/icons`.
There are no copied theme/icon assets in `public` and no authoring sync step.

The home page is an 18-column periodic table with 118 element positions and
detached lanthanide/actinide rows. Alpha occupies Hydrogen's position; unassigned
positions are deliberately empty. Family colors use a conventional pastel scheme
(periodic tables do not have one universal color standard).

`src/collections/themes.ts` stores discovery metadata: theme name, icon fallback,
element position, and available palettes. `/themes/alpha` previews the current
Neutral palette and links to the component documentation and playground.

The library owns reusable design contracts in `src/collections/<theme>/theme.json`,
structural CSS in `theme.css`, and light/dark color variants in `palettes/*.css`.
The app consumes these exports from version 0.4.0 by default. Local library
testing is opt-in; deployment and CI continue to use the published package.

## Run

Create a classic GitHub token with only `read:packages` using an account that can
access the package. Supply it as `NODE_AUTH_TOKEN` in your shell, then install.
This Bash/zsh prompt keeps the token out of shell history and terminal output:

```sh
printf 'GitHub package token: '
read -rs NODE_AUTH_TOKEN
printf '\n'
export NODE_AUTH_TOKEN
npm ci
npm run dev -- --port 3010
```

No sibling library checkout is required. The lockfile pins the published package.
The committed `.npmrc` reads the token from the environment. Never commit the token.
npm does not load Next.js `.env.local` files when installing dependencies.

## Local library development

With `elements-ui` checked out beside `elements` and both projects' dependencies
installed, run these commands from `elements`:

```sh
npm run ui:local
npm run dev -- --port 3010
```

Or build/install the local library and start the app in one command:

```sh
npm run dev:local -- --port 3010
```

`ui:local` builds the sibling library, packs its public package contents, and
installs that local snapshot into the app's `node_modules`. No publication or
global `npm link` is involved, avoiding a second React instance from the sibling
checkout. It leaves `package.json` and `package-lock.json` unchanged. Rerun it
after library edits and restart Next.js; this is not a live/watch link. Installing
new library dependencies may still require registry access.

To return to the release pinned in `package.json`:

```sh
npm run ui:published
```

Restoring the published package requires `NODE_AUTH_TOKEN`. A fresh `npm ci` also
restores all locked dependencies. Neither local command runs in CI or deployment.

## Vercel

Create a dedicated classic GitHub token, such as `vercel-elements-read`, with only
`read:packages` and an expiration you can maintain. GitHub's npm registry requires
authentication even when the package is public.

In the Vercel project's Settings > Environment Variables, add `NODE_AUTH_TOKEN`
as a sensitive variable with the token as its value. Enable Production and Preview
(and Development if needed), then redeploy. Do not use a `NEXT_PUBLIC_` prefix.
The repository's `.npmrc` already routes `@jnpll` packages to GitHub Packages and
passes this environment variable during installation. No custom install command
or sibling library checkout is needed.

GitHub Actions continues to use its own `GITHUB_TOKEN`; the Vercel token does not
need to be added to GitHub Actions secrets.

The app uses Next's webpack option for development and builds. Turbopack's CSS
worker was unable to bind its local port in the verification environment.

Component pages include live examples, generated JSX, API tables, and property
controls for all 56 components. The playground contains complete UI layout presets.
Both respect the current theme and support mobile previews.

## Verify

Unit tests use Vitest and React Testing Library:

```sh
npm test
npm run test:watch
CI=true npm run test:ci
```

The suite covers catalog integrity, generated recipes, controls, clipboard
feedback, component preview state, and layout interactions.
Coverage is scoped to these app-owned modules, not generated demo recipes or
third-party library internals. CI enforces coverage thresholds and writes JUnit,
JSON, HTML coverage, and LCOV reports to `test-results/unit/`.

The Unit tests workflow runs on pushes, pull requests, and manual dispatch. It
installs the published GitHub package with `packages: read` and `GITHUB_TOKEN`.
It always summarizes and uploads
available reports, even if tests fail; a failing test still fails the job.
This app is maintained separately at https://github.com/jnpll/elements.

The Build app workflow also runs on every push, pull request, and manual dispatch.
It checks GitHub Packages access online, installs from the lockfile into a fresh
npm cache, typechecks, and builds the production app. Missing package access,
download failures, type errors, and build errors fail the job. Its summary is
written even when a check fails.

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Run the browser checks with the app running on port 3010. Set `TEST_URL` to use
another address or `PLAYWRIGHT_EXECUTABLE_PATH` to use an existing Chromium binary.
Screenshots are written to the ignored `test-results` directory.

Deployment only needs this repository. Authenticate package installation with a
`read:packages` token, or an authorized GitHub Actions `GITHUB_TOKEN`. In the
package settings, grant this repository Actions access if the package is private.
External pull requests may require maintainer approval or suitable package access.
