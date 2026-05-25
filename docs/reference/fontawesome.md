# Font Awesome Icons

Slide Spec validates every `fa_icon` and `*_fa_icon` YAML field against this supported icon set.

Use the canonical value in YAML:

```yaml
fa_icon: fa-code
```

Brand icons use the same simple form:

```yaml
fa_icon: fa-github
```

The validator also accepts explicit Font Awesome style prefixes such as `fa-solid fa-code`, `fas fa-code`, `fa-brands fa-github`, and `fab fa-github`. Prefer the canonical value unless you need to be explicit for compatibility with existing content.

## Supported Icons

<FontAwesomeIconReference />

## Schema Usage

All public schemas reference `defs.schema.json#/$defs/fontAwesomeIcon` for icon fields. Template docs list the default for each slot so authors can omit icon fields unless they need a different visual.

_FontAwesome has **many** more icons available. We do not import the entire set to keep the bundled CLI and static app size smaller. If you need any specific icons imported, please [open an issue](https://github.com/lreading/slide-spec/issues) with the icon name.

