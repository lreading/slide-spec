# Supply Chain

Slide Spec's release supply chain is intentionally simple:

- source changes land in `main`
- a maintainer creates a signed `v*` tag
- GitHub Actions runs the release workflow
- the CLI is published to npm with provenance
- GitHub Releases receives the source tarball and SBOM artifact

## What the current workflow does

The release workflow is triggered by `push` events on tags matching `v*`.
It currently:

- runs the shared quality workflow before publishing
- publishes `@slide-spec/cli` to npm with provenance enabled
- creates a GitHub Release with generated release notes
- attaches a source tarball and `sbom.cyclonedx.json`

Latest release assets:

- <https://github.com/lreading/slide-spec/releases/latest>

## Maintainer expectations

For a stable release, use a signed tag such as `v1.0.0` and push it after the release commit is ready. The workflow is designed to trust the tag event, not ad hoc release edits.

Recommended maintainer steps:

1. Make sure the release commit is clean and reviewed.
2. Sign the release tag.
3. Push the signed tag to `origin`.
4. Let GitHub Actions publish the CLI and create the release artifacts.
5. Verify the npm package, GitHub Release, and attached SBOM.

## Prereleases

The current workflow does not yet distinguish prereleases from stable releases. If you want to ship prereleases later, decide the tag convention and npm dist-tag behavior first, then update the workflow and release docs together.

## Related docs

- [SBOM](/meta/sbom)
