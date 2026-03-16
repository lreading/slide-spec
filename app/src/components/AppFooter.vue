<script setup lang="ts">
import { computed } from 'vue'

import { contentRepository } from '../content/ContentRepository'

const site = contentRepository.getSiteContent()
const footerLink = computed(() => ({
  label: site.app_footer?.repository_label?.trim() || 'github.com/lreading/td-project-updates',
  url: site.app_footer?.repository_url?.trim() || 'https://github.com/lreading/td-project-updates',
}))
</script>

<template>
  <footer class="app-footer">
    <a
      :href="footerLink.url"
      target="_blank"
      rel="noreferrer"
      class="app-footer__link"
    >
      <i class="fab fa-github app-footer__icon" aria-hidden="true"></i>
      <span>{{ footerLink.label }}</span>
    </a>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0.4rem var(--page-gutter) 0.8rem;
}

.app-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: var(--font-mono);
  color: #9ca3af;
  transition: color 120ms ease, opacity 120ms ease;
  opacity: 0.88;
}

.app-footer__link:hover {
  color: #ffffff;
  opacity: 1;
}

.app-footer__icon {
  font-size: 1rem;
}
</style>
