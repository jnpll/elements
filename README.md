# Elements

A Next.js documentation app consuming `@jnpll/elements-ui@0.2.0` from GitHub Packages
through its public exports. No library components are copied into this app.

## Collections

The home page is an 18-column periodic table with 118 element positions and
detached lanthanide/actinide rows. Alpha occupies Hydrogen's position; unassigned
positions are deliberately empty. Family colors use a conventional pastel scheme
(periodic tables do not have one universal color standard).

`src/collections/themes.ts` stores discovery metadata: theme name, icon fallback,
element position, and available palettes. `/themes/alpha` previews the current
Neutral palette and links to the component documentation and playground.

The library owns reusable design contracts in `src/collections/<theme>/theme.json`,
structural CSS in `theme.css`, and light/dark color variants in `palettes/*.css`.
The app still consumes the published 0.2.0 stylesheet. New collection-specific
library exports will become available after the next library release; no local
library checkout is used by this app.

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

Component pages include live examples, generated JSX, and API tables. The
playground covers all 55 components with prop controls or example selectors, light/dark appearance,
preview widths, reset, and copyable JSX. Navigation, theme preferences, and
component-specific playground URLs are supported.

## Verify

Unit tests use Vitest and React Testing Library:

```sh
npm test
npm run test:watch
CI=true npm run test:ci
```

The suite covers catalog integrity, generated recipes, controls, clipboard
feedback, and playground state.
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
