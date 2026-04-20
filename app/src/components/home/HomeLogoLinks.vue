<script setup lang="ts">
import { computed } from 'vue'

import { assetResolver } from '../../content/AssetResolver'
import type { HomeLogoLinkContent } from '../../types/content'

interface ResolvedHomeLogoLink extends HomeLogoLinkContent {
  resolvedLogoUrl?: string
}

const props = defineProps<{
  logos: HomeLogoLinkContent[]
}>()

const resolvedLogos = computed<ResolvedHomeLogoLink[]>(() =>
  props.logos.map((logo) => ({
    ...logo,
    resolvedLogoUrl: assetResolver.resolve(logo.logo.url),
  })),
)
</script>

<template>
  <section v-if="resolvedLogos.length" class="home-logo-links" aria-label="Featured projects">
    <a
      v-for="logo in resolvedLogos"
      :key="logo.name"
      class="home-logo-links__item"
      :href="logo.url"
      target="_blank"
      rel="noreferrer"
    >
      <span class="home-logo-links__mark">
        <img
          v-if="logo.resolvedLogoUrl"
          class="home-logo-links__image"
          :src="logo.resolvedLogoUrl"
          :alt="logo.logo.alt"
        >
      </span>
      <span class="home-logo-links__name">{{ logo.name }}</span>
    </a>
  </section>
</template>

<style scoped>
.home-logo-links {
  position: relative;
  z-index: 1;
  width: min(100%, 42rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.15rem;
  margin: 0.25rem auto 0;
}

.home-logo-links__item {
  display: grid;
  justify-items: center;
  gap: 0.55rem;
  width: 8rem;
  color: var(--secondary-text);
  text-align: center;
}

.home-logo-links__item:hover {
  color: var(--primary-text);
}

.home-logo-links__item:focus-visible {
  outline: 2px solid rgba(232, 52, 28, 0.6);
  outline-offset: 4px;
  border-radius: 8px;
}

.home-logo-links__mark {
  width: 4.8rem;
  height: 4.8rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 22px rgba(5, 8, 15, 0.18);
}

.home-logo-links__image {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.home-logo-links__name {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
  line-height: 1.25;
  font-weight: 600;
}
</style>
