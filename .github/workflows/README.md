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
| `release-publish.yml` | GitHub Release created, or manual | Builds the tag and publishes all packages to GitHub Packages |
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

**`secrets.PAT_TOKEN`** — a personal access token with `repo` and
`write:packages` scope. It is used for three things the built-in `GITHUB_TOKEN`
cannot do:

- reading the private `@blue-orange-ai/primitives-*` dependencies, which live in
  other repositories' registries
- pushing tags, branches and Releases in a way that **triggers other
  workflows** — events authored by `GITHUB_TOKEN` do not start new runs, which
  would leave every release unpublished
- publishing packages to the organisation's registry

**Branch protection on `main`** — if it is enabled, the token's identity needs
permission to push the release commit (a bypass allowance), otherwise
`versioning.yml` fails at the push step.

## Notes

- Release commits carry `[skip ci]`, which GitHub honours, so a release never
  triggers another release.
- Branch *creation* pushes are ignored by `maintenance-release.yml` — opening
  `release/v0.2.1` or `hotfix/v0.1.4` does not cut a version; the first commit
  pushed to it does.
- `lerna publish from-package` skips versions already on the registry, so
  re-running `release-publish.yml` against a tag is safe when a publish
  half-failed.
- `versioning.yml` and `maintenance-release.yml` run Lerna through
  `npx lerna@8.1.9` (pinned to the root devDependency) instead of installing the
  whole workspace just to rewrite version numbers. Bump the pin alongside the
  `lerna` devDependency in the root `package.json`.
