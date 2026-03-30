# Security Posture Report

A quarterly security readout for engineering leadership. This example shows how Slide Spec works for security teams tracking vulnerabilities, compliance progress, patches, and remediation priorities.

The full YAML for this example lives in the [`examples/security-posture`](https://github.com/lreading/slide-spec/tree/main/examples/security-posture) directory.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-home.png" alt="Sentinel Security Reports home page" />
</figure>

## The scenario

Sentinel Corp's security team publishes quarterly posture reports. The data comes from internal vulnerability scanners, compliance dashboards, and audit findings - all hand-authored into `generated.yaml`.

## Site configuration

The three required links point to an internal security dashboard, policy documentation, and the OWASP Top 10 reference. The badge marks the content as confidential.

```yaml
site:
  title: Sentinel Security Reports
  project_badge:
    label: Confidential
    fa_icon: fa-shield-halved
    icon_position: before
  home_hero:
    title_primary: Sentinel
    title_accent: Security
    subtitle: Posture Reports
  home_intro: Quarterly security posture reports for Sentinel Corp.
  home_cta_label: View latest report
  presentations_cta_label: View all reports
  links:
    repository:
      label: Security Dashboard
      url: https://sentinel.example.com/security
      eyebrow: Internal
    docs:
      label: Security Policies
      url: https://sentinel.example.com/policies
      eyebrow: Documentation
    community:
      label: OWASP Top 10
      url: https://owasp.org/www-project-top-ten/
      eyebrow: Reference
```

## Slides

### Hero

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-hero.png" alt="Security Posture hero slide" />
</figure>

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Security
    title_accent: Posture
    subtitle_prefix: Q1 2026
    quote: Security is not a feature. It is a foundation.
```

### Key initiatives (section-list-grid)

Three security workstreams completed during the quarter.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-sections.png" alt="Key initiatives slide" />
</figure>

```yaml
- template: section-list-grid
  enabled: true
  title: Key initiatives
  subtitle: Security work completed in Q1
  content:
    sections:
      - title: Dependency scanning
        bullets:
          - Automated scanning enabled on all 47 production services
          - Zero unpatched critical CVEs in production dependencies
          - Average remediation time reduced from 12 days to 3
      - title: Penetration testing
        bullets:
          - Annual pentest completed by an external firm
          - Zero critical findings, 3 medium findings remediated
          - Attack surface mapping updated for all public endpoints
      - title: Hardware security keys
        bullets:
          - YubiKey 5 series deployed to all 120 engineering staff
          - Phishing-resistant WebAuthn enabled on all internal tools
          - Legacy TOTP disabled for engineering accounts
```

### Security metrics (metrics-and-links)

Metrics track vulnerability remediation, patch times, compliance controls, and audit findings. Mentions reference compliance certifications.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-metrics.png" alt="Security metrics slide" />
</figure>

```yaml
- template: metrics-and-links
  enabled: true
  title: Security metrics
  subtitle: Posture indicators for Q1
  content:
    section_heading: Compliance and audits
    stats_heading: This quarter
    trend_suffix: vs Q4 2025
    show_deltas: true
    stat_keys:
      - vulnerabilities_remediated
      - mean_time_to_patch
      - compliance_controls
      - audit_findings
    mentions:
      - type: Audit
        title: "SOC 2 Type II readiness assessment scored 94% control coverage."
      - type: Certification
        title: "ISO 27001 certification renewed for another year."
        url_label: View certificate
        url: https://sentinel.example.com/compliance/iso27001
```

### Security releases (timeline)

Security advisories and patches published during the quarter.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-timeline.png" alt="Security releases timeline" />
</figure>

```yaml
- template: timeline
  enabled: true
  title: Security releases
  subtitle: Patches and advisories from Q1
  content:
    latest_badge_label: Latest
    footer_link_label: View all advisories
    featured_release_ids:
      - sa-2026-003
      - sa-2026-002
```

### Remediation priorities (action-cards)

CTA cards for Q2 security priorities with links to internal plans.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/sec-actions.png" alt="Remediation priorities slide" />
</figure>

```yaml
- template: action-cards
  enabled: true
  title: Remediation priorities
  subtitle: What needs attention in Q2
  content:
    footer_text: Security is everyone's responsibility.
    cards:
      - title: Secrets rotation
        description: Identify and rotate all long-lived credentials in production services by end of Q2.
        url_label: View the plan
        url: https://sentinel.example.com/security/secrets-rotation
      - title: Bug bounty prep
        description: Review scope, rules, and reward tiers before the public launch.
        url_label: Draft program
        url: https://sentinel.example.com/security/bug-bounty-draft
      - title: SBOM generation
        description: Integrate SBOM generation into CI/CD for all release pipelines.
        url_label: Implementation guide
        url: https://sentinel.example.com/security/sbom-guide
```

### Generated data

Security-specific metrics with keys like `vulnerabilities_remediated` and `mean_time_to_patch`. Releases are security advisories.

```yaml
generated:
  id: 2026-q1-posture
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats:
    vulnerabilities_remediated:
      label: Vulnerabilities remediated
      current: 89
      previous: 62
      delta: 27
      metadata:
        comparison_status: complete
        warning_codes: []
    mean_time_to_patch:
      label: Mean time to patch (days)
      current: 3
      previous: 12
      delta: -9
      metadata:
        comparison_status: complete
        warning_codes: []
  releases:
    - id: sa-2026-003
      version: SA-2026-003
      published_at: "2026-03-08"
      url: https://sentinel.example.com/advisories/sa-2026-003
      summary_bullets:
        - Patched XSS vulnerability in the dashboard search component
        - Updated Content-Security-Policy headers across all services
```
