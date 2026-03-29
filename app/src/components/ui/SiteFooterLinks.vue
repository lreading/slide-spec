<script setup lang="ts">
import { computed } from 'vue'

import type { SiteContent } from '../../types/content'

const orderedKeys = ['repository', 'docs', 'community'] as const

type FooterLinkKey = (typeof orderedKeys)[number]

const props = defineProps<{
  site: Pick<SiteContent, 'links'>
}>()

const iconClassByKey: Record<FooterLinkKey, string> = {
  repository: 'fab fa-github',
  docs: 'fas fa-book',
  community: 'fas fa-globe',
}

const footerLinks = computed(() =>
  orderedKeys
    .filter((key) => props.site.links[key])
    .map((key) => {
      const url = props.site.links[key].url
      const parsed = new URL(url)
      const path = parsed.pathname.replace(/\/$/, '')

      return {
        key,
        url,
        text: `${parsed.host}${path}`,
        iconClass: iconClassByKey[key],
      }
    }),
)
</script>

<template>
  <div class="site-footer-links">
    <template v-for="(link, index) in footerLinks" :key="link.key">
      <a
        class="site-footer-links__link"
        :href="link.url"
        target="_blank"
        rel="noreferrer"
      >
        <i :class="[link.iconClass, 'site-footer-links__icon']"></i>
        <p>{{ link.text }}</p>
      </a>
      <div
        v-if="index < footerLinks.length - 1"
        class="site-footer-links__separator"
        aria-hidden="true"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  color: #9ca3af;
  font: 400 clamp(0.8rem, 1.4vw, 1rem) / 1.5 var(--font-mono);
}

.site-footer-links__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: inherit;
  text-decoration: none;
  transition:
    color 160ms ease,
    transform 160ms ease;
}

.site-footer-links__link:hover {
  color: #d1d5db;
  transform: translateY(-1px);
}

.site-footer-links__link p {
  margin: 0;
}

.site-footer-links__icon {
  color: inherit;
}

.site-footer-links__separator {
  width: 0.25rem;
  height: 0.25rem;
  margin: auto 0;
  border-radius: 999px;
  background-color: rgba(156, 163, 175, 0.55);
}
</style>
