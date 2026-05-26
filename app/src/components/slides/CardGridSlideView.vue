<script setup lang="ts">
import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import FaIcon from '../ui/FaIcon.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type { CardGridSlide, PresentationContent } from '../../types/content'

defineProps<{
  presentation: PresentationContent
  slide: CardGridSlide
  slideNumber: number
  slideTotal: number
}>()
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <div class="card-grid">
      <SurfaceCard
        v-for="(item, index) in slide.content.items"
        :key="`${item.title}-${index}`"
        class="card-grid__card"
        :href="item.url"
        :interactive="true"
        hover-shift="x"
        accent="left"
        accent-visibility="hover"
        :min-height="'88px'"
        :max-height="'104px'"
        radius="md"
        padding="20px 24px"
      >
        <div class="card-grid__marker">
          <FaIcon v-if="item.fa_icon" :fa-icon="item.fa_icon" />
          <span v-else>{{ item.marker_text ?? String(index + 1).padStart(2, '0') }}</span>
        </div>
        <p class="card-grid__text">{{ item.title }}</p>
        <FaIcon v-if="slide.content.card_arrow_fa_icon" :fa-icon="slide.content.card_arrow_fa_icon" class="card-grid__arrow" />
      </SurfaceCard>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: max-content;
  align-content: start;
  gap: 20px;
}

.card-grid__card {
  display: flex;
  align-items: center;
}

.card-grid__marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(232, 52, 28, 0.15);
  color: #e8341c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 20px;
  border: 1px solid rgba(232, 52, 28, 0.3);
  font: 700 14px/1 var(--font-mono);
}

.card-grid__text {
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 0.25rem;
  margin: 0;
  color: #e0e0e0;
  font-size: 18px;
  font-weight: 500;
}

.card-grid__arrow {
  color: #555577;
  font-size: 14px;
  transition:
    color 0.2s,
    transform 0.2s;
}

.card-grid__card:hover .card-grid__arrow {
  color: #e8341c;
  transform: translateX(3px);
}

.card-grid__card:last-child:nth-child(odd) {
  grid-column: span 2;
}

@media (max-width: 767px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .card-grid__card:last-child:nth-child(odd) {
    grid-column: span 1;
  }
}
</style>
