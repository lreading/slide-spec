<script setup lang="ts">
import { computed } from 'vue'

import { contentRepository } from '../content/ContentRepository'
import { resolveAppFooterContent, resolveAttributionContent } from '../content/contentDefaults'

const site = contentRepository.getSiteContent()
const footerLink = computed(() => resolveAppFooterContent(site))
const attribution = computed(() => resolveAttributionContent(site))

const formatFooterUrl = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined
  }

  try {
    const parsed = new URL(value)
    return `${parsed.host}${parsed.pathname.replace(/\/$/, '')}`
  } catch {
    return value
  }
}

const repositoryText = computed(() => formatFooterUrl(footerLink.value.repository_url))
const attributionText = computed(() => formatFooterUrl(attribution.value.url))
</script>

<template>
  <footer v-if="(footerLink.repository_url && footerLink.repository_label) || attribution.enabled" class="app-footer">
    <div class="app-footer__content">
      <a
        v-if="footerLink.repository_url && footerLink.repository_label"
        :href="footerLink.repository_url"
        target="_blank"
        rel="noreferrer"
        class="app-footer__link"
        :aria-label="footerLink.repository_label"
        :title="footerLink.repository_label"
      >
        <i class="fab fa-github app-footer__icon" aria-hidden="true"></i>
        <span>{{ repositoryText }}</span>
      </a>
      <a
        v-if="attribution.enabled"
        :href="attribution.url"
        target="_blank"
        rel="noreferrer"
        class="app-footer__link app-footer__link--attribution"
        :aria-label="attribution.label"
        :title="attribution.label"
      >
        <i class="fab fa-github app-footer__icon" aria-hidden="true"></i>
        <span>{{ attributionText }}</span>
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0.4rem var(--page-gutter) 0.8rem;
}

.app-footer__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.9rem;
}

.app-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font: 400 0.95rem/1.5 var(--font-mono);
  color: #9ca3af;
  text-decoration: none;
  transition:
    color 160ms ease,
    transform 160ms ease;
  opacity: 0.92;
}

.app-footer__link:hover {
  color: #d1d5db;
  opacity: 1;
  transform: translateY(-1px);
}

.app-footer__icon {
  color: inherit;
}

.app-footer__link--attribution {
  color: #9ca3af;
}
</style>
