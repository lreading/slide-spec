<script setup lang="ts">
import mascotUrl from '../../assets/mascot.png'
import AccentDivider from '../ui/AccentDivider.vue'
import FloatingMascot from '../ui/FloatingMascot.vue'
import HeroDecor from '../ui/HeroDecor.vue'
import ResourcePillLink from '../ui/ResourcePillLink.vue'

import type {
  GeneratedPresentationData,
  PresentationDeck,
  SiteContent,
  ThankYouSlide,
} from '../../types/content'

defineProps<{
  deck: PresentationDeck
  generated: GeneratedPresentationData
  site: SiteContent
  slide: ThankYouSlide
}>()
</script>

<template>
  <div class="slide-container">
    <HeroDecor
      primary-corner="top-left"
      secondary-corner="bottom-right"
      :primary-opacity="0.13"
      :secondary-opacity="0.05"
    />

    <div class="content-wrap">
      <div class="relative group mascot-wrap">
        <FloatingMascot
          :src="mascotUrl"
          alt="Cupcake Mascot"
          size="clamp(150px, 20vw, 200px)"
          :glow-opacity="0.5"
        />
      </div>

      <div class="text-block">
        <h1 class="hero-title">{{ slide.heading }}<span class="accent-text">!</span></h1>
        <AccentDivider width="4rem" :opacity="0.8" padding="0.5rem 0" />
        <h2 class="hero-subtitle">{{ slide.message }}</h2>
      </div>

      <div class="actions">
        <ResourcePillLink
          :href="site.links.repository.url"
          :icon="['fab', 'github']"
          eyebrow="Source Code"
          title="GitHub Repo"
        />
        <ResourcePillLink
          :href="site.links.docs.url"
          icon="book"
          eyebrow="Documentation"
          title="Read the Docs"
        />
        <ResourcePillLink
          :href="site.links.owasp.url"
          icon="shield-alt"
          eyebrow="Foundation"
          title="OWASP Project"
        />
      </div>
    </div>

    <div class="footer-wrap">
      <p class="footer-quote">"making threat modeling less threatening"</p>
    </div>

    <div class="deck-mark">
      <span class="deck-mark__name">Threat Dragon</span>
      <span class="deck-mark__subtitle">{{ deck.subtitle }}</span>
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
  gap: 2.5rem;
  width: 100%;
  max-width: 64rem;
  padding: clamp(1.5rem, 4vh, 2.75rem) 2rem 6.5rem;
}

.mascot-wrap {
  margin-bottom: 0.5rem;
}

.text-block {
  text-align: center;
}

.hero-title {
  margin: 0;
  font-size: 4.5rem;
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
  letter-spacing: 0.025em;
  color: #d0d0e8;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-wrap {
  position: absolute;
  right: 0;
  bottom: 0.9rem;
  left: 0;
  width: 100%;
  z-index: 10;
  text-align: center;
}

.footer-quote {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-style: italic;
  font-weight: 300;
  font-family: var(--font-mono);
  color: #6b7280;
  opacity: 0.6;
  letter-spacing: 0.05em;
}

.deck-mark {
  position: absolute;
  right: 2rem;
  bottom: 1.7rem;
  z-index: 10;
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  color: #d0d0e8;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.deck-mark__name {
  color: #9ca3af;
  font-weight: 500;
}

.deck-mark__subtitle {
  color: #e8341c;
  font-weight: 700;
}

@media (max-width: 959px) {
  .hero-title {
    font-size: clamp(3rem, 8vw, 4.5rem);
  }

  .hero-subtitle {
    font-size: clamp(1.4rem, 3.8vw, 1.875rem);
    line-height: 1.3;
  }
}

@media (max-width: 767px) {
  .slide-container {
    min-height: 100%;
    padding: 3rem 0 5rem;
  }

  .content-wrap {
    gap: 2rem;
    padding: 0 1.5rem 5.5rem;
  }

  .hero-title {
    font-size: clamp(2.5rem, 10vw, 3.5rem);
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .pill-btn {
    justify-content: center;
    width: 100%;
  }

  .footer-wrap {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    margin-top: 1rem;
  }

  .deck-mark {
    position: relative;
    right: auto;
    bottom: auto;
    margin-top: 1rem;
  }
}
</style>
