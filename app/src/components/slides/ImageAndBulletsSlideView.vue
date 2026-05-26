<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import RichText from '../ui/RichText.vue'

import { assetResolver } from '../../content/AssetResolver'
import type { ImageAndBulletsSlide, PresentationContent } from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  slide: ImageAndBulletsSlide
  slideNumber: number
  slideTotal: number
}>()

const imageSide = computed(() => props.slide.content.image_side ?? 'right')
const imageUrl = computed(() => {
  const src = props.slide.content.image?.src

  return src ? assetResolver.resolve(src) : undefined
})
const imageAlt = computed(() => props.slide.content.image?.alt?.trim() || '')
const imageDescription = computed(() => props.slide.content.image?.description?.trim() || undefined)
const bullets = computed(() => props.slide.content.bullets ?? [])
const hasImage = computed(() => Boolean(imageUrl.value))
const hasBullets = computed(() => bullets.value.length > 0)
const showSplitLayout = computed(() => hasImage.value && hasBullets.value)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <section
      class="image-and-bullets"
      :class="{
        'image-and-bullets--split': showSplitLayout,
        'image-and-bullets--image-only': hasImage && !hasBullets,
        'image-and-bullets--bullets-only': hasBullets && !hasImage,
        'image-and-bullets--image-left': imageSide === 'left',
      }"
    >
      <figure v-if="hasImage" class="image-panel">
        <img :src="imageUrl" :alt="imageAlt" class="image-panel__image" />
        <figcaption v-if="imageDescription" class="image-panel__description">
          <RichText :text="imageDescription" />
        </figcaption>
      </figure>

      <ul v-if="hasBullets" class="bullet-list">
        <li v-for="bullet in bullets" :key="bullet" class="bullet-list__item">{{ bullet }}</li>
      </ul>
    </section>
  </StandardSlideLayout>
</template>

<style scoped>
.image-and-bullets {
  flex: 1;
  min-height: 0;
}

.image-and-bullets--split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}

.image-and-bullets--split.image-and-bullets--image-left .image-panel {
  order: 1;
}

.image-and-bullets--split.image-and-bullets--image-left .bullet-list {
  order: 2;
}

.image-panel {
  margin: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.image-panel__image {
  width: 100%;
  max-height: 25rem;
  object-fit: contain;
  border-radius: 0.75rem;
  border: 1px solid #333344;
  background: rgba(20, 20, 30, 0.75);
}

.image-panel__description {
  margin-top: 0.75rem;
  color: #c7c7df;
  font-size: 0.95rem;
  font-style: italic;
}

.image-and-bullets--image-only {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-and-bullets--image-only .image-panel {
  width: min(100%, 52rem);
}

.image-and-bullets--image-only .image-panel__image {
  max-height: 29rem;
}

.image-and-bullets--bullets-only {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bullet-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.image-and-bullets--split .bullet-list {
  align-content: center;
}

.image-and-bullets--bullets-only .bullet-list {
  width: min(100%, 52rem);
}

.bullet-list__item {
  position: relative;
  padding-left: 1.25rem;
  color: #d0d0e8;
  line-height: 1.55;
  font-size: 1.05rem;
}

.bullet-list__item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #e8341c;
  font-weight: 700;
}

@media (max-width: 959px) {
  .image-and-bullets--split {
    grid-template-columns: 1fr;
    align-content: start;
  }

  .image-and-bullets--split .image-panel,
  .image-and-bullets--split .bullet-list,
  .image-and-bullets--split.image-and-bullets--image-left .image-panel,
  .image-and-bullets--split.image-and-bullets--image-left .bullet-list {
    order: initial;
  }
}
</style>
