# Dependency security and CI review

## Original audit
The first npm audit report for the branch's resolved dependency tree contained 8 moderate findings, 0 high and 0 critical. The findings were dependency-chain entries:

- `@typescript-eslint/eslint-plugin` 8.72.2
- `@typescript-eslint/parser` 8.72.2
- `@typescript-eslint/type-utils` 8.72.2
- `@typescript-eslint/typescript-estree` 8.72.2
- `@typescript-eslint/utils` 8.72.2
- `typescript-eslint` 8.72.2
- `eslint-config-next` 16.4.6 (affected through `typescript-eslint`)
- `minimatch` 10.2.6, advisory GHSA-g3hv-75wg-m249 (globparts-amplification denial of service)

The npm-proposed `eslint-config-next@15.5.29` remediation was not applied because it would downgrade the Next.js lint config across a major-version boundary relative to Next.js 16.

## Applied remediation
- ESLint: `10.15.0`
- eslint-config-next: `16.4.6` (aligned with Next.js `16.4.6`)
- TypeScript: `5.9.3`
- typescript-eslint and @typescript-eslint packages: `8.72.2`
- minimatch: `11.0.8`, patched release for GHSA-g3hv-75wg-m249
- Targeted npm overrides pin the affected typescript-estree minimatch dependency to the patched minimatch release.
- Targeted peer overrides align eslint-plugin-import, eslint-plugin-jsx-a11y and eslint-plugin-react with the root ESLint 10 installation. Their currently resolved upstream peer ranges still declare ESLint 9 as the maximum; this metadata mismatch is documented rather than hidden. CI exercises the actual configured lint run.

## Verification
GitHub Actions workflow enforces:
1. Generate and commit package-lock.json on the existing implementation branch.
2. Install the exact lock with `npm ci`.
3. Run `npm audit --audit-level=moderate` (fails on moderate or higher findings).
4. Run lint, typecheck and production build.
5. Smoke-test that production cannot enter demo mode.
6. Smoke-test the Supabase-free local demo.

The resolved audit JSON reported 0 vulnerabilities after the targeted minimatch override. The exact lockfile is committed at repository root.

## Known non-vulnerability notices
- Node's `punycode` deprecation warning is emitted by a transitive tool dependency during CI; it is not an npm audit finding.
- Artifact upload action was moved to a Node 24 runtime release to avoid the Node 20 action deprecation.
- Review the three peer overrides periodically. Remove each only when the corresponding upstream plugin declares ESLint 10 compatibility and the lockfile/tests are refreshed.
