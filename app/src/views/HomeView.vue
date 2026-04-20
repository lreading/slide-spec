<script setup lang="ts">
import { computed } from 'vue'

import HomeHero from '../components/home/HomeHero.vue'
import HomeLogoLinks from '../components/home/HomeLogoLinks.vue'
import HeroDecor from '../components/ui/HeroDecor.vue'
import SiteFooterLinks from '../components/ui/SiteFooterLinks.vue'
import { contentRepository } from '../content/ContentRepository'
import { resolveHomeLogos } from '../content/contentDefaults'

const site = contentRepository.getSiteContent()
const presentations = contentRepository.listPresentations()

const homeLogos = computed(() => resolveHomeLogos(site))
</script>

<template>
  <main class="home-page" :class="{ 'home-page--with-logos': homeLogos.length > 0 }">
    <HeroDecor :primary-opacity="0.5" :secondary-opacity="0.3" />

    <HomeHero :site="site" :presentations="presentations" />
    <HomeLogoLinks :logos="homeLogos" />

    <div class="footer-wrap">
      <SiteFooterLinks :site="site" />
    </div>
  </main>
</template>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #1e1e2e;
  color: #ffffff;
  padding: 2.5rem var(--page-gutter) 3.5rem;
}

.home-page--with-logos {
  justify-content: flex-start;
  overflow-x: hidden;
}

.footer-wrap {
  position: absolute;
  right: 0;
  bottom: 2rem;
  left: 0;
  z-index: 1;
}

.home-page--with-logos .footer-wrap {
  position: relative;
  width: 100%;
  margin-top: 2.5rem;
}

@media (max-width: 767px) {
  .home-page {
    justify-content: flex-start;
    padding-top: 3rem;
  }

  .footer-wrap {
    position: relative;
    bottom: auto;
    margin-top: 2.5rem;
  }

  :deep(.site-footer-links) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  :deep(.site-footer-links__separator) {
    display: none;
  }
}
</style>
