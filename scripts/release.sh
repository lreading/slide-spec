#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: $0 <tag>"
  echo 'Example: ./scripts/release.sh "v0.0.1-alpha.1"'
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

tag_name="$1"

if [[ ! "$tag_name" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-(alpha|beta|rc)(\.[0-9A-Za-z-]+)?)?$ ]]; then
  echo "Error: unsupported release tag format: $tag_name" >&2
  echo "Expected one of:" >&2
  echo "  vX.Y.Z" >&2
  echo "  vX.Y.Z-alpha" >&2
  echo "  vX.Y.Z-alpha.N" >&2
  echo "  vX.Y.Z-beta" >&2
  echo "  vX.Y.Z-beta.N" >&2
  echo "  vX.Y.Z-rc" >&2
  echo "  vX.Y.Z-rc.N" >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this script must be run from inside a git work tree." >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: git remote 'origin' is not configured." >&2
  exit 1
fi

if git rev-parse -q --verify "refs/tags/${tag_name}" >/dev/null 2>&1; then
  echo "Error: tag already exists locally: $tag_name" >&2
  exit 1
fi

if git ls-remote --exit-code --tags origin "refs/tags/${tag_name}" >/dev/null 2>&1; then
  echo "Error: tag already exists on origin: $tag_name" >&2
  exit 1
fi

git tag -s "$tag_name" -m "$tag_name"
git tag -v "$tag_name"
git push origin "$tag_name"

