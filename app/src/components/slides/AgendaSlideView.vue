<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import { getSlideLabel } from '../../content/slideLabels'
import type { AgendaSlide, PresentationContent } from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  slide: AgendaSlide
  slideNumber: number
  slideTotal: number
}>()

const agendaItems = computed(() => {
  let roadmapIncluded = false

  return props.presentation.slides
    .filter((entry) => entry.enabled && entry.kind !== 'title' && entry.kind !== 'agenda')
    .flatMap((entry) => {
      if (entry.kind === 'roadmap') {
        if (roadmapIncluded) {
          return []
        }

        roadmapIncluded = true
        return [props.presentation.roadmap?.agenda_label?.trim()].filter(Boolean)
      }

      return [getSlideLabel(entry, props.presentation)].filter(Boolean)
    })
})
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <div class="agenda-grid">
      <SurfaceCard
        v-for="(item, index) in agendaItems"
        :key="item"
        class="agenda-card"
        :interactive="true"
        hover-shift="x"
        accent="left"
        accent-visibility="hover"
        :min-height="'88px'"
        :max-height="'104px'"
        radius="md"
        padding="20px 24px"
      >
        <div class="number-badge">{{ String(index + 1).padStart(2, '0') }}</div>
        <p class="card-text">{{ item }}</p>
        <FontAwesomeIcon icon="chevron-right" class="card-arrow" />
      </SurfaceCard>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.agenda-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: max-content;
  align-content: start;
  gap: 20px;
}

.agenda-card {
  display: flex;
  align-items: center;
}

.number-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(232, 52, 28, 0.15);
  color: #e8341c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  margin-right: 20px;
  font-size: 14px;
  border: 1px solid rgba(232, 52, 28, 0.3);
  flex-shrink: 0;
}

.card-text {
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 0.25rem;
  font-size: 18px;
  color: #e0e0e0;
  font-weight: 500;
  margin: 0;
}

.card-arrow {
  color: #555577;
  font-size: 14px;
  transition:
    color 0.2s,
    transform 0.2s;
}

.agenda-card:hover .card-arrow {
  color: #e8341c;
  transform: translateX(3px);
}

.agenda-card:last-child:nth-child(odd) {
  grid-column: span 2;
}

@media (max-width: 767px) {
  .agenda-grid {
    grid-template-columns: 1fr;
  }

  .agenda-card:last-child:nth-child(odd) {
    grid-column: span 1;
  }
}
</style>
