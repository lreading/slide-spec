<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import { assetResolver } from '../../content/AssetResolver'

import type { PresentationContent, SectionTitleSlide } from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  slide: SectionTitleSlide
  slideNumber: number
  slideTotal: number
}>()

const imageUrl = computed(() => assetResolver.resolve(props.slide.content.image_url))
const imageAlt = computed(() => props.slide.content.image_alt?.trim() || '')
</script>

<template>
  <StandardSlideLayout
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
    content-padding="56px 80px"
    :show-dots="false"
  >
    <section class="section-title" aria-label="Section title slide content">
      <img
        v-if="imageUrl"
        class="section-title__image"
        :src="imageUrl"
        :alt="imageAlt"
      />
      <h1 class="section-title__title">{{ slide.content.title }}</h1>
      <p v-if="slide.content.subtitle" class="section-title__subtitle">{{ slide.content.subtitle }}</p>
    </section>
  </StandardSlideLayout>
</template>

<style scoped>
.section-title {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
}

.section-title__image {
  width: clamp(64px, 10vw, 120px);
  height: clamp(64px, 10vw, 120px);
  object-fit: contain;
}

.section-title__title {
  margin: 0;
  max-width: 22ch;
  color: #ffffff;
  font-size: clamp(2.5rem, 4.6vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.section-title__subtitle {
  margin: 0;
  max-width: 54ch;
  color: #b6b7cf;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.45;
  font-style: italic;
}

@media (max-width: 767px) {
  .section-title {
    gap: 0.9rem;
  }

  .section-title__title {
    max-width: 100%;
  }

  .section-title__subtitle {
    max-width: 100%;
  }
}
</style>
