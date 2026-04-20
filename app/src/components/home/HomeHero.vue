<script setup lang="ts">
import { computed } from 'vue'

import AccentDivider from '../ui/AccentDivider.vue'
import ActionButton from '../ui/ActionButton.vue'
import FloatingMascot from '../ui/FloatingMascot.vue'
import ProjectBadgePill from '../ui/ProjectBadgePill.vue'
import { assetResolver } from '../../content/AssetResolver'
import { resolveHomeHeroContent } from '../../content/contentDefaults'
import { getProjectBadgeDisplay } from '../../content/projectBadge'
import type { PresentationIndexEntry, SiteContent } from '../../types/content'

const props = defineProps<{
  site: SiteContent
  presentations: PresentationIndexEntry[]
}>()

const featuredPresentation = computed(() => props.presentations.find((entry) => entry.featured) ?? props.presentations[0])
const badge = computed(() => getProjectBadgeDisplay(props.site))
const heroContent = computed(() => resolveHomeHeroContent(props.site))
const mascotUrl = computed(() => assetResolver.resolve(props.site.mascot?.url))
const mascotAlt = computed(() => props.site.mascot?.alt?.trim() || undefined)
const docsLink = computed(() => props.site.links.docs)
</script>

<template>
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
</template>

<style scoped>
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

@media (max-width: 767px) {
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
}
</style>
