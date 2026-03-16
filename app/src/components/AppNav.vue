<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { contentRepository } from '../content/ContentRepository'

const route = useRoute()
const site = contentRepository.getSiteContent()
const presentations = contentRepository.listPresentations()
const mobileOpen = ref(false)

const featuredPresentation = computed(() => presentations.find((entry) => entry.featured) ?? presentations[0])
const navigationContent = computed(() => ({
  brandTitle: site.navigation?.brand_title?.trim() || 'Threat Dragon Updates',
  homeLabel: site.navigation?.home_label?.trim() || 'Home',
  presentationsLabel: site.navigation?.presentations_label?.trim() || 'Presentations',
  latestPresentationLabel:
    site.navigation?.latest_presentation_label?.trim() || 'Latest Presentation',
  toggleLabel: site.navigation?.toggle_label?.trim() || 'Toggle navigation',
}))
const presentationRoute = computed(() =>
  route.name === 'presentation' && typeof route.params.presentationId === 'string'
    ? { name: 'presentation' as const, params: { presentationId: route.params.presentationId } }
    : { name: 'presentation' as const, params: { presentationId: featuredPresentation.value.id } },
)
const isPresentationActive = computed(() => route.name === 'presentation')

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <header class="app-nav">
    <div class="app-nav__inner">
      <RouterLink :to="{ name: 'home' }" class="app-nav__brand">
        <span class="app-nav__title">{{ navigationContent.brandTitle }}</span>
      </RouterLink>

      <button
        type="button"
        class="app-nav__toggle"
        :aria-expanded="mobileOpen ? 'true' : 'false'"
        aria-controls="app-nav-links"
        :aria-label="navigationContent.toggleLabel"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="app-nav__toggle-line" :class="{ 'app-nav__toggle-line--top-open': mobileOpen }"></span>
        <span class="app-nav__toggle-line" :class="{ 'app-nav__toggle-line--middle-open': mobileOpen }"></span>
        <span class="app-nav__toggle-line" :class="{ 'app-nav__toggle-line--bottom-open': mobileOpen }"></span>
      </button>

      <nav id="app-nav-links" class="app-nav__links" :class="{ 'app-nav__links--open': mobileOpen }">
        <RouterLink :to="{ name: 'home' }" class="app-nav__link" :class="{ 'app-nav__link--active': route.name === 'home' }">
          {{ navigationContent.homeLabel }}
        </RouterLink>
        <RouterLink
          :to="{ name: 'presentations' }"
          class="app-nav__link"
          :class="{ 'app-nav__link--active': route.name === 'presentations' }"
        >
          {{ navigationContent.presentationsLabel }}
        </RouterLink>
        <RouterLink
          :to="presentationRoute"
          class="app-nav__link"
          :class="{ 'app-nav__link--active': isPresentationActive }"
        >
          {{ navigationContent.latestPresentationLabel }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-nav {
  position: relative;
  z-index: 40;
  width: 100%;
  background:
    linear-gradient(180deg, rgba(30, 38, 55, 0.98) 0%, rgba(24, 31, 46, 0.98) 100%);
  backdrop-filter: blur(16px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08),
    0 8px 18px rgba(0, 0, 0, 0.14);
}

.app-nav::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(232, 52, 28, 0.55) 0%,
    rgba(232, 52, 28, 0.18) 22%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.app-nav__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  padding: 0.95rem var(--page-gutter);
}

.app-nav__brand {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.app-nav__title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--primary-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-nav__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
}

.app-nav__toggle-line {
  display: block;
  width: 1.2rem;
  height: 2px;
  margin: 0 auto;
  border-radius: 9999px;
  background-color: var(--primary-text);
  transition: transform 180ms ease, opacity 180ms ease;
}

.app-nav__toggle-line--top-open {
  transform: translateY(0.4rem) rotate(45deg);
}

.app-nav__toggle-line--middle-open {
  opacity: 0;
}

.app-nav__toggle-line--bottom-open {
  transform: translateY(-0.4rem) rotate(-45deg);
}

.app-nav__links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.app-nav__link {
  padding: 0;
  color: var(--secondary-text);
  transition: color 120ms ease;
}

.app-nav__link:hover {
  color: #c52c16;
}

.app-nav__link--active {
  color: #e8341c;
}

@media (max-width: 899px) {
  .app-nav__toggle {
    display: inline-flex;
  }

  .app-nav__links {
    position: absolute;
    top: calc(100% + 0.6rem);
    right: 0;
    left: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0.9rem;
    padding: 1rem var(--page-gutter);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background-color: rgba(28, 35, 50, 0.98);
  }

  .app-nav__links--open {
    display: flex;
  }

  .app-nav__link {
    text-align: left;
  }
}
</style>
