<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import { slideLabels } from '../../content/slideLabels'
import type { AgendaSlide, PresentationDeck } from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  slide: AgendaSlide
  slideNumber: number
}>()

const agendaItems = computed(() =>
  props.deck.slides
    .filter((entry) => entry.enabled && entry.kind !== 'title' && entry.kind !== 'agenda')
    .map((entry) => slideLabels[entry.kind]),
)
</script>

<template>
  <StandardSlideLayout
    title="Agenda"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
  >
    <div class="agenda-grid">
      <div v-for="(item, index) in agendaItems" :key="item" class="agenda-card">
        <div class="number-badge">{{ String(index + 1).padStart(2, '0') }}</div>
        <p class="card-text">{{ item }}</p>
        <FontAwesomeIcon icon="chevron-right" class="card-arrow" />
      </div>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.agenda-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
}

.agenda-card {
  background-color: #252535;
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  transition:
    transform 0.2s,
    background-color 0.2s;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.agenda-card:hover {
  background-color: #2a2a3e;
  border-left-color: #e8341c;
  transform: translateX(5px);
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
