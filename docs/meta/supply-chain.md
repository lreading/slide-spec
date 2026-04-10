# Supply Chain

Slide Spec's release supply chain is intentionally simple:

- source changes land in `main`
- a maintainer creates a signed `v*` tag
- GitHub Actions runs the release workflow
- the CLI is published to npm with provenance via trusted publishing
- GitHub Releases receives generated notes plus the source tarball and SBOM artifact

## What the current workflow does

The release workflow is triggered by `push` events on tags matching `v*`.
It currently:

- runs the shared quality workflow before publishing
- derives the npm version from the pushed tag
- publishes `@slide-spec/cli` to npm with provenance enabled
- maps prereleases to explicit npm dist-tags
- creates a GitHub Release with generated release notes plus a release metadata preface
- attaches a source tarball and `sbom.cyclonedx.json`

Latest release assets:

- <https://github.com/lreading/slide-spec/releases/latest>

## Maintainer expectations

For a stable release, use a signed tag such as `v1.0.0` and push it after the release commit is ready. The workflow is designed to trust the tag event, not ad hoc release edits.

Recommended maintainer steps:

1. Make sure the release commit is clean and reviewed.
2. Create a signed annotated tag:
   - `git tag -s v1.0.0 -m "v1.0.0"`
   - or use the helper: `./scripts/release.sh v1.0.0`
3. Verify the tag locally:
   - `git tag -v v1.0.0`
4. Push the signed tag to `origin`:
   - `git push origin v1.0.0`
5. Let GitHub Actions publish the CLI and create the release artifacts.
6. Verify the npm package, GitHub Release, generated notes, and attached SBOM.

## Prereleases

Prereleases are also tag-driven and should use signed tags.

Supported prerelease tag formats:

- `vX.Y.Z-alpha`
- `vX.Y.Z-alpha.N`
- `vX.Y.Z-beta`
- `vX.Y.Z-beta.N`
- `vX.Y.Z-rc`
- `vX.Y.Z-rc.N`

Dist-tag mapping:

- `alpha` prereleases publish to npm with `--tag alpha`
- `beta` prereleases publish to npm with `--tag beta`
- `rc` prereleases publish to npm with `--tag rc`
- stable releases publish to npm with `--tag latest`

Recommended prerelease flow:

1. Make sure the prerelease commit is clean and reviewed.
2. Create a signed prerelease tag:
   - `git tag -s v0.0.1-alpha -m "v0.0.1-alpha"`
   - or use the helper: `./scripts/release.sh v0.0.1-alpha`
3. Verify the tag locally:
   - `git tag -v v0.0.1-alpha`
4. Push the signed tag:
   - `git push origin v0.0.1-alpha`
5. Confirm that npm publishes to the expected prerelease dist-tag and that GitHub marks the release as a prerelease.

`git commit -S` only signs commits. It does not sign tags. If you want a signed release tag, use `git tag -s ...`.

## Release notes

GitHub generates the change list from merged work and can highlight first-time contributors automatically. The workflow prepends a small project-specific section with:

- the npm package name and version
- docs and live-site links
- the release channel
- attached artifact references for the source tarball and SBOM
- provenance/trusted-publishing context

## Related docs

- [SBOM](/meta/sbom)
