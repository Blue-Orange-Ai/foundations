# Release workflows

Every `@blue-orange-ai/foundations-*` package ships at one version (Lerna fixed
mode, tracked in `lerna.json`). These workflows automate what
[LERNA_GUIDE.md](../../LERNA_GUIDE.md) describes doing by hand: `lerna version`
rewrites `lerna.json`, all 16 `package.json` files and the internal `^X.Y.Z`
ranges between packages, then `lerna publish from-package` pushes them to
GitHub Packages.

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | push / PR to `main` | `lerna run build` + `lerna run test` |
| `versioning.yml` | push to `main`, or manual | Bumps the version, commits, tags `vX.Y.Z`, opens `release/vX.Y.Z`, publishes a GitHub Release |
| `release-publish.yml` | GitHub Release published, or manual | Builds the tag and publishes all packages to GitHub Packages |
| `maintenance-release.yml` | push to `release/**` or `hotfix/**` | Cuts the next patch *within that version line* and releases it |
| `hotfix-from-tag.yml` | manual | Opens a maintenance branch at any existing tag |
| `dirty-build.yml` | push with `[dirty]`, or manual | Publishes a throwaway prerelease off a feature branch |

## Cutting a release

The bump comes from the head commit message on `main` — with squash merges,
that is the PR title:

| Commit / PR title | Result |
|---|---|
| `[major] drop React 17 support` | `0.2.0` → `1.0.0` |
| `[minor] add calendar range picker` | `0.2.0` → `0.3.0` |
| `fix dropdown overflow` | `0.2.0` → `0.2.1` |
| anything containing `[skip release]` | no release |

Each release produces:

- a commit on `main` — `chore(release): v0.2.1 [skip ci]`
- an annotated tag `v0.2.1`
- a branch `release/v0.2.1` at that tag, so the code behind any release can be
  checked out (and patched) by name
- a GitHub Release, which triggers `release-publish.yml`

`versioning.yml` can also be run from the Actions tab with an explicit
patch/minor/major choice.

## Patching an older release

Old lines stay patchable forever:

1. Check out the release branch — `release/v0.1.4` for anything released by
   these workflows, or run **Open Maintenance Branch from Tag** to create
   `hotfix/v0.1.4` from a tag that predates them.
2. Push the fix to that branch.
3. `maintenance-release.yml` finds the highest tag in the `0.1` line, bumps the
   patch (`v0.1.5`), tags, and releases it.

`[minor]` on a `release/**` branch bumps the minor within the line instead
(`v0.1.4` → `v0.2.0`); `hotfix/**` branches are always patch, and their GitHub
Releases are marked as prereleases.

Old-line patches never take over npm's `latest`. `release-publish.yml` compares
the tag against the highest tag in the repository and publishes anything older
under a `v<major>.<minor>` dist-tag:

```bash
npm i @blue-orange-ai/foundations-core          # newest release
npm i @blue-orange-ai/foundations-core@v0.1     # head of the 0.1 line
```

## Dirty builds

Put `[dirty]` in a commit message on any branch other than `main`,
`release/**` or `hotfix/**` (or run the workflow by hand) to publish a
prerelease of every package:

```bash
npm i @blue-orange-ai/foundations-core@dirty
npm i @blue-orange-ai/foundations-core@0.2.1-dirty.20260804-121530.a1b2c3d4
```

The version is the next patch plus a timestamp and commit sha, so a dirty build
always sorts above the release it branched from and below the next real one.
Internal dependencies are pinned with `--exact` so a consumer can never end up
mixing a dirty package with a released sibling.

Nothing is committed to the branch — the bumped `package.json` files live in a
local commit that only the `v<version>` tag points at, so feature branches stay
free of version churn and `main` never inherits a dirty version.

## Requirements

### Reaching the private `primitives` packages

Four packages here build against `@blue-orange-ai/primitives-*`, which is
published from the **private** `primitives` repository. In the lockfile they are
the only entries resolved from `npm.pkg.github.com`:

```
@blue-orange-ai/primitives-block-editor   @blue-orange-ai/primitives-logger
@blue-orange-ai/primitives-graph          @blue-orange-ai/primitives-map
```

Everything else comes from public npm, and the sibling `foundations-*` packages
are workspace links — so the runner needs exactly one credential, for the
`npm.pkg.github.com` host.

Two pieces have to line up:

**1. The npmrc on the runner.** `actions/setup-node` does this, given a scope:

```yaml
- uses: actions/setup-node@v4
  with:
    registry-url: 'https://npm.pkg.github.com'
    scope: '@blue-orange-ai'
```

It writes `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}` into the
runner's npmrc. The repo's own `.npmrc` only maps the scope to the registry and
holds no credential, so nothing conflicts, and `npx lerna` still comes from
public npm.

**2. `NODE_AUTH_TOKEN` on every step that touches the registry** — `npm ci`,
`lerna publish`. It is not job-wide on purpose; steps that don't need the
credential don't get it.

### Which token

**`secrets.PAT_TOKEN` — a classic PAT (what these workflows use).** Scopes:
`repo` and `write:packages` (which implies `read:packages`). The account it
belongs to needs read access to the `primitives` repository. Fine-grained tokens
do **not** work against the npm registry — GitHub Packages npm accepts classic
PATs, `GITHUB_TOKEN`, and GitHub App installation tokens only.

Three things here need it that `GITHUB_TOKEN` cannot do:

- read `@blue-orange-ai/primitives-*` from another repository's registry
- push tags, branches and Releases in a way that **triggers other workflows** —
  events authored by `GITHUB_TOKEN` start no new runs, so the release would be
  tagged and never published
- publish to the organisation's registry

Store it as an **organisation** secret so `primitives`, `foundations` and every
other consumer share one credential and one rotation.

> If the org enforces SAML SSO, the PAT must be authorised for the org
> (`Configure SSO` next to the token). An unauthorised token fails with a 401
> that looks identical to a missing-scope error.

**Alternative — grant the packages access to this repo.** On each
`primitives-*` package: *Package settings → Manage Actions access → Add
repository → foundations (Read)*. Then `GITHUB_TOKEN` can install them and no
secret is needed for `npm ci`. Note this only covers **reading**: `PAT_TOKEN` is
still required for tagging/releasing (workflow triggering) and publishing, so it
narrows the blast radius rather than removing the secret.

**Alternative — a GitHub App.** Install an org-level app with
`contents: write` + `packages: write`, and mint a token per run with
`actions/create-github-app-token@v2`. Installation tokens work against the npm
registry, expire in an hour, and are not tied to a person's account. Worth it if
PAT ownership is a concern; otherwise the classic PAT is less machinery.

### Verifying access

From a workflow run (or locally with the same token):

```bash
npm view @blue-orange-ai/primitives-graph version \
  --registry=https://npm.pkg.github.com \
  --//npm.pkg.github.com/:_authToken=$TOKEN
```

`401` means the token is unauthenticated (missing, wrong, or SSO-unauthorised);
`404` on a package that exists means the token authenticated but the account
cannot see the `primitives` repo — grant it read access there.

Each installing workflow fails fast with an explicit message when `PAT_TOKEN` is
unset, rather than surfacing a bare 401 from deep inside `npm ci`.

### Branch protection

If `main` is protected, the token's identity needs permission to push the
release commit (a bypass allowance), otherwise `versioning.yml` fails at the
push step.

## Notes

- Release commits carry `[skip ci]`, which GitHub honours, so a release never
  triggers another release.
- Branch *creation* pushes are ignored by `maintenance-release.yml` — opening
  `release/v0.2.1` or `hotfix/v0.1.4` does not cut a version; the first commit
  pushed to it does.
- `lerna publish from-package` skips versions already on the registry, so
  re-running `release-publish.yml` against a tag is safe when a publish
  half-failed.
- `release-publish.yml` listens for the release `published` event, not `created`.
  `softprops/action-gh-release` saves the Release as a draft before finalising it,
  and GitHub starts no workflow runs for draft release events — with `created` the
  publish never fired at all, which is how v0.4.1 and v0.4.2 came to be tagged and
  released without ever reaching the registry.
- `versioning.yml` and `maintenance-release.yml` run Lerna through
  `npx lerna@8.1.9` (pinned to the root devDependency) instead of installing the
  whole workspace just to rewrite version numbers. Bump the pin alongside the
  `lerna` devDependency in the root `package.json`.
