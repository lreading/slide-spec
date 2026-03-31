<script setup lang="ts">
import { computed } from 'vue'

import AccentDivider from '../components/ui/AccentDivider.vue'
import ActionButton from '../components/ui/ActionButton.vue'
import FloatingMascot from '../components/ui/FloatingMascot.vue'
import HeroDecor from '../components/ui/HeroDecor.vue'
import ProjectBadgePill from '../components/ui/ProjectBadgePill.vue'
import SiteFooterLinks from '../components/ui/SiteFooterLinks.vue'
import { assetResolver } from '../content/AssetResolver'
import { getProjectBadgeDisplay } from '../content/projectBadge'
import { contentRepository } from '../content/ContentRepository'
import { resolveHomeHeroContent } from '../content/contentDefaults'

const site = contentRepository.getSiteContent()
const presentations = contentRepository.listPresentations()

const featuredPresentation = computed(() => presentations.find((entry) => entry.featured) ?? presentations[0])
const badge = computed(() => getProjectBadgeDisplay(site))
const heroContent = computed(() => resolveHomeHeroContent(site))
const mascotUrl = computed(() => assetResolver.resolve(site.mascot?.url))
const mascotAlt = computed(() => site.mascot?.alt?.trim() || undefined)
const docsLink = computed(() => site.links.docs)
</script>

<template>
  <main class="home-page">
    <HeroDecor :primary-opacity="0.5" :secondary-opacity="0.3" />

    <div class="hero-shell">
      <ProjectBadgePill v-if="badge" :badge="badge" class="hero-badge" />

      <div class="hero-actions">
        <ActionButton
          v-if="featuredPresentation"
          :to="{ name: 'presentation', params: { presentationId: featuredPresentation.id } }"
          class="hero-cta"
        >
          <span class="hero-cta__single">{{ site.home_cta_label }}</span>
        </ActionButton>
        <ActionButton :to="{ name: 'presentations' }" variant="secondary" class="hero-cta">
          <span class="hero-cta__single">{{ site.presentations_cta_label }}</span>
        </ActionButton>
        <ActionButton
          v-if="docsLink"
          :href="docsLink.url"
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          class="hero-cta"
        >
          <span class="hero-cta__single">{{ docsLink.label }}</span>
        </ActionButton>
      </div>

      <div v-if="mascotUrl" class="mascot-wrap">
        <FloatingMascot :src="mascotUrl" :alt="mascotAlt" size="clamp(9rem, 18vw, 12rem)" />
      </div>

      <div class="hero-copy">
        <h1
          v-if="heroContent.title_primary || heroContent.title_accent"
          class="hero-title"
        >
          <span v-if="heroContent.title_primary">{{ heroContent.title_primary }}</span>
          <span v-if="heroContent.title_primary && heroContent.title_accent">&nbsp;</span>
          <span v-if="heroContent.title_accent" class="accent-text">{{ heroContent.title_accent }}</span>
        </h1>
        <AccentDivider v-if="heroContent.title_primary || heroContent.title_accent || heroContent.subtitle" />
        <h2 v-if="heroContent.subtitle" class="hero-subtitle">
          {{ heroContent.subtitle }}
        </h2>
        <p v-if="site.home_intro" class="hero-description">
          {{ site.home_intro }}
        </p>
      </div>
    </div>

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

.hero-shell {
  position: relative;
  z-index: 1;
  width: min(100%, 70rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  text-align: center;
}

.hero-badge {
  margin-bottom: 1rem;
}

.mascot-wrap {
  position: relative;
}

.hero-copy {
  display: grid;
  gap: 0.75rem;
}

.hero-title {
  margin: 0;
  font-size: clamp(3.5rem, 8vw, 5.8rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.accent-text {
  color: #e8341c;
}

.hero-subtitle {
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2.35rem);
  line-height: 1.2;
  font-weight: 300;
  color: #d0d0e8;
}

.hero-subtitle-strong {
  color: #ffffff;
  font-weight: 600;
}

.hero-description {
  max-width: 44rem;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  margin: 0 auto;
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  line-height: 1.7;
  color: #9ca3af;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1rem;
}

.hero-cta {
  flex: 0 0 13.5rem;
  min-width: 13rem;
  min-height: 3.8rem;
}

.hero-cta__single {
  display: block;
  font-size: 1.05rem;
  line-height: 1.1;
  font-weight: 500;
}

.footer-wrap {
  position: absolute;
  right: 0;
  bottom: 2rem;
  left: 0;
  z-index: 1;
}

@media (max-width: 767px) {
  .home-page {
    justify-content: flex-start;
    padding-top: 3rem;
  }

  .hero-shell {
    gap: 1.5rem;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }

  .hero-cta {
    width: 100%;
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
