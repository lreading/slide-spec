<script setup lang="ts">
import { computed } from 'vue'

import mascotUrl from '../../assets/mascot.png'
import AccentDivider from '../ui/AccentDivider.vue'
import FloatingMascot from '../ui/FloatingMascot.vue'
import HeroDecor from '../ui/HeroDecor.vue'
import ProjectBadgePill from '../ui/ProjectBadgePill.vue'
import SiteFooterLinks from '../ui/SiteFooterLinks.vue'
import { getProjectBadgeDisplay } from '../../content/projectBadge'

import type { PresentationDeck, SiteContent, TitleSlide } from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  site: SiteContent
  slide: TitleSlide
}>()

const badge = computed(() => getProjectBadgeDisplay(props.site))
const titlePrimary = computed(() => props.slide.title_primary?.trim() || 'OWASP')
const titleAccent = computed(() => props.slide.title_accent?.trim() || 'Threat Dragon')
const subtitlePrefix = computed(
  () => props.slide.subtitle_prefix?.trim() || 'Quarterly Community Update',
)
</script>

<template>
  <div class="slide-container">
    <HeroDecor />

    <div class="content-wrap">
      <ProjectBadgePill v-if="badge" :badge="badge" class="title-badge" />

      <div class="relative group">
        <FloatingMascot :src="mascotUrl" alt="Cupcake Mascot" size="clamp(9rem, 18vw, 12rem)" />
      </div>

      <div class="text-block">
        <h1 class="hero-title">
          {{ titlePrimary }} <span class="accent-text">{{ titleAccent }}</span>
        </h1>
        <AccentDivider />
        <h2 class="hero-subtitle">
          {{ subtitlePrefix }} —
          <span class="hero-subtitle-strong">{{ deck.subtitle }}</span>
        </h2>
        <p class="hero-quote">"{{ slide.quote }}"</p>
      </div>
    </div>

    <div class="footer-wrap">
      <SiteFooterLinks :site="site" />
    </div>
  </div>
</template>

<style scoped>
.slide-container {
  width: 100%;
  min-height: min(80vh, 720px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1e1e2e;
  color: #ffffff;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.content-wrap {
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 56rem;
  padding: 0 2rem;
}

.title-badge {
  margin-bottom: 1rem;
}

.text-block {
  text-align: center;
}

.hero-title {
  margin: 0 0 0.5rem;
  font-size: 3.75rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.accent-text {
  color: #e8341c;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 300;
  color: #d0d0e8;
}

.hero-subtitle-strong {
  font-weight: 600;
  color: #ffffff;
}

.hero-quote {
  margin: 0;
  padding-top: 1.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-style: italic;
  font-weight: 300;
  color: #9ca3af;
  opacity: 0.8;
}

.footer-wrap {
  position: absolute;
  bottom: 2rem;
  width: 100%;
  z-index: 10;
}

@media (max-width: 959px) {
  .hero-title {
    font-size: clamp(2.75rem, 7vw, 3.75rem);
  }

  .hero-subtitle {
    font-size: clamp(1.4rem, 3.8vw, 1.875rem);
    line-height: 1.3;
  }

  :deep(.site-footer-links) {
    flex-wrap: wrap;
    gap: 1rem;
  }

  :deep(.site-footer-links__separator) {
    display: none;
  }
}

@media (max-width: 767px) {
  .slide-container {
    min-height: 100%;
    padding: 3rem 0 5rem;
  }

  .content-wrap {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  .hero-title {
    font-size: clamp(2.25rem, 9vw, 3rem);
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-quote {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .footer-wrap {
    position: relative;
    bottom: auto;
    margin-top: 2rem;
  }

  :deep(.site-footer-links) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>
