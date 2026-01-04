# Lerna Package Manager Guide

This guide covers how to use Lerna to manage the `foundations` monorepo.

---

## Table of Contents

1. [What is Lerna?](#what-is-lerna)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Common Commands](#common-commands)
5. [Publishing Packages](#publishing-packages)
6. [Versioning](#versioning)
7. [Managing Dependencies](#managing-dependencies)
8. [Running Scripts](#running-scripts)
9. [Troubleshooting](#troubleshooting)

---

## What is Lerna?

Lerna is a tool for managing JavaScript/TypeScript monorepos. It optimizes the workflow around managing multi-package repositories with git and npm.

**Key Benefits:**
- **Unified versioning** - Keep all packages in sync or version independently
- **Dependency linking** - Local packages automatically link to each other
- **Batch operations** - Run commands across all packages
- **Smart publishing** - Only publish packages that have changed

---

## Project Structure

```
foundations/
├── lerna.json           # Lerna configuration
├── package.json         # Root package.json with workspaces
├── packages/
│   ├── core/            # @anthropic/core package
│   ├── block-editor/    # @anthropic/block-editor package
│   ├── map/             # @anthropic/map package
│   ├── graph/           # @anthropic/graph package
│   └── ...              # Other packages
```

### Configuration Files

**lerna.json**
```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "version": "0.0.87"
}
```

- `version`: Current version of all packages (fixed/locked mode)

**package.json (root)**
```json
{
  "private": true,
  "workspaces": ["packages/*"],
  "devDependencies": {
    "lerna": "^8.1.8"
  }
}
```

---

## Getting Started

### Installation

```bash
# Install all dependencies (including linking local packages)
npm install
```

### Verify Setup

```bash
# List all packages managed by Lerna
npx lerna list

# List packages with their versions
npx lerna list --long

# Show package dependency graph
npx lerna list --graph
```

---

## Common Commands

### List Packages

```bash
# List all packages
npx lerna list

# List with versions and paths
npx lerna list -la

# Show as JSON
npx lerna list --json

# List only changed packages since last release
npx lerna changed
```

### View Package Information

```bash
# Show what packages have changed since last tag
npx lerna changed

# Show detailed diff of changes
npx lerna diff
```

---

## Publishing Packages

### Prerequisites

Before publishing, ensure:
1. **Clean working tree** - All changes must be committed
2. **Logged into npm** - Run `npm login` if publishing to npm
3. **Correct permissions** - You have publish access to the packages

### Publish Commands

```bash
# Publish packages that have changed since last release
npx lerna publish

# Publish with a specific version bump
npx lerna publish patch    # 0.0.87 -> 0.0.88
npx lerna publish minor    # 0.0.87 -> 0.1.0
npx lerna publish major    # 0.0.87 -> 1.0.0

# Publish a specific version
npx lerna publish 1.0.0

# Publish from a specific git ref (useful for CI)
npx lerna publish from-git

# Publish packages tagged in current commit
npx lerna publish from-package
```

### Publish Options

```bash
# Skip git operations (tag, commit, push)
npx lerna publish --no-git-tag-version

# Skip npm publish (only version bump)
npx lerna publish --skip-npm

# Publish with a dist-tag (e.g., beta, next)
npx lerna publish --dist-tag beta

# Dry run (see what would happen)
npx lerna publish --dry-run

# Force publish all packages (even unchanged)
npx lerna publish --force-publish

# Publish specific packages only
npx lerna publish --force-publish=@scope/package-name
```

### Publish Workflow

1. Make your changes and commit them
2. Ensure working tree is clean: `git status`
3. Run: `npx lerna publish`
4. Select version bump when prompted
5. Confirm the packages to publish
6. Lerna will:
   - Update `lerna.json` version
   - Update each package's `package.json`
   - Create a git commit and tag
   - Push to remote
   - Publish to npm

---

## Versioning

### Fixed/Locked Mode (Current Setup)

All packages share the same version number, defined in `lerna.json`.

```json
{
  "version": "0.0.87"
}
```

When any package changes, all packages are versioned together.

### Independent Mode

To enable independent versioning, set version to "independent":

```json
{
  "version": "independent"
}
```

Each package can then have its own version.

### Version Commands

```bash
# Just update versions (no publish)
npx lerna version

# Version with specific bump
npx lerna version patch
npx lerna version minor
npx lerna version major

# Version with conventional commits
npx lerna version --conventional-commits

# Create version without git operations
npx lerna version --no-git-tag-version --no-push
```

---

## Managing Dependencies

### Adding Dependencies

```bash
# Add a dependency to a specific package
npx lerna add lodash --scope=@scope/package-name

# Add a dev dependency
npx lerna add jest --scope=@scope/package-name --dev

# Add a dependency to all packages
npx lerna add lodash

# Add a local package as dependency
npx lerna add @scope/core --scope=@scope/other-package
```

### Using npm/yarn Workspaces

Since this project uses npm workspaces, you can also:

```bash
# Add dependency to specific package
npm install lodash -w packages/core

# Add dev dependency
npm install jest -D -w packages/core

# Install all dependencies
npm install
```

### Bootstrap (Legacy)

```bash
# Link local packages and install dependencies (legacy command)
npx lerna bootstrap

# Clean and reinstall
npx lerna clean && npm install
```

> **Note:** With npm workspaces, `npm install` handles most of what `lerna bootstrap` did.

---

## Running Scripts

### Run Script in All Packages

```bash
# Run "build" script in all packages that have it
npx lerna run build

# Run in parallel
npx lerna run build --parallel

# Run with streaming output
npx lerna run build --stream

# Limit concurrency
npx lerna run build --concurrency=2
```

### Run Script in Specific Packages

```bash
# Run in a specific package
npx lerna run build --scope=@scope/core

# Run in multiple specific packages
npx lerna run build --scope=@scope/core --scope=@scope/map

# Run in packages matching a glob
npx lerna run build --scope="@scope/*-client"

# Exclude packages
npx lerna run build --ignore=@scope/dev-tools
```

### Run in Dependency Order

```bash
# Run respecting dependency order (default)
npx lerna run build

# Include dependencies of scoped packages
npx lerna run build --scope=@scope/app --include-dependencies
```

### Execute Arbitrary Commands

```bash
# Run any command in all packages
npx lerna exec -- rm -rf node_modules

# Run in specific package
npx lerna exec --scope=@scope/core -- npm test

# Run with package info available
npx lerna exec -- echo \$LERNA_PACKAGE_NAME
```

---

## Troubleshooting

### Error: Working tree has uncommitted changes

```
lerna ERR! EUNCOMMIT Working tree has uncommitted changes
```

**Solution:** Commit or stash your changes before publishing.

```bash
# Check what's uncommitted
git status

# Commit changes
git add -A && git commit -m "Your message"

# Or stash temporarily
git stash
npx lerna publish
git stash pop
```

### Error: Package not found in registry

```
lerna ERR! E404 Package not found
```

**Solution:** Ensure you're logged in and have publish permissions.

```bash
npm login
npm whoami  # Verify logged in user
```

### Clearing Lerna Cache

```bash
# Remove all node_modules
npx lerna clean -y

# Reinstall
npm install
```

### View Debug Logs

```bash
# Run with verbose output
npx lerna publish --loglevel=verbose

# Check debug log file
cat lerna-debug.log
```

### Force Republish

If packages weren't published correctly:

```bash
# Publish from current package.json versions
npx lerna publish from-package
```

---

## Best Practices

1. **Always commit before publishing** - Keep your working tree clean
2. **Use conventional commits** - Makes changelogs easier to generate
3. **Test before publishing** - Run `npx lerna run test` first
4. **Use dry-run** - Preview with `--dry-run` before actual publish
5. **Tag prereleases** - Use `--dist-tag` for beta/alpha releases

---

## Additional Resources

- [Lerna Documentation](https://lerna.js.org/)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npx lerna list` | List all packages |
| `npx lerna changed` | Show changed packages |
| `npx lerna diff` | Show diff since last release |
| `npx lerna run <script>` | Run npm script in all packages |
| `npx lerna exec -- <cmd>` | Execute command in all packages |
| `npx lerna version` | Bump versions only |
| `npx lerna publish` | Version and publish to npm |
| `npx lerna clean` | Remove node_modules from packages |
