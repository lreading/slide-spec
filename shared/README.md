# slide-spec shared

This package contains shared content types and validation helpers used by both the Vue app and the CLI.

Current responsibilities:

- presentation content interfaces
- site config interfaces
- template ids and template validation helpers
- shared assertion helpers for validation

This package should stay small and focused. If a change is only needed by one runtime, keep it in that runtime instead of moving it here.
