# Elements

A Next.js documentation app consuming the sibling `@jnpll/elements-ui` package
through its public exports. No library components are copied into this app.

## Run

Install dependencies in `../elements-ui` first, then run:

```sh
npm install
npm run dev -- --port 3010
```

`predev` and `prebuild` rebuild the sibling library. During development, rebuild
the library after editing its source to refresh its compiled exports.

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
feedback, and playground state. The test scripts rebuild the sibling library.
Coverage is scoped to these app-owned modules, not generated demo recipes or
third-party library internals. CI enforces coverage thresholds and writes JUnit,
JSON, HTML coverage, and LCOV reports to `test-results/unit/`.

The Unit tests workflow runs on pushes, pull requests, and manual dispatch. It
checks out the library's `v0.2.0` tag beside this app so the local file dependency
works without GitHub Packages credentials. It always summarizes and uploads
available reports, even if tests fail; a failing test still fails the job.
This app is maintained separately at https://github.com/jnpll/elements.

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Run the browser checks with the app running on port 3010. Set `TEST_URL` to use
another address or `PLAYWRIGHT_EXECUTABLE_PATH` to use an existing Chromium binary.
Screenshots are written to the ignored `test-results` directory.

Development uses a local `file:../elements-ui` dependency. Version 0.2.0 is also
published as `@jnpll/elements-ui` on GitHub Packages. Deploy with both folders
available, or use the registry version with authenticated package installation.
