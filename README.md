# Elements

A Next.js documentation app consuming `@jnpll/elements-ui@0.2.0` from GitHub Packages
through its public exports. No library components are copied into this app.

## Run

Authenticate with a classic GitHub token with `read:packages`, then install:

```sh
npm login --scope=@jnpll --auth-type=legacy --registry=https://npm.pkg.github.com
npm ci
npm run dev -- --port 3010
```

No sibling library checkout is required. The lockfile pins the published package.
Keep credentials in your user-level npm configuration, not in this repository.

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
