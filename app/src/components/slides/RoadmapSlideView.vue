<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type {
  PresentationDeck,
  RoadmapSlide,
  RoadmapStageContent,
  RoadmapStageStatus,
  SiteContent,
} from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  site: SiteContent
  slide: RoadmapSlide
  slideNumber: number
  slideTotal: number
}>()

const stageOrder: RoadmapStageStatus[] = ['completed', 'in-progress', 'planned', 'future']
const fallbackSection: RoadmapStageContent = {
  label: 'Roadmap',
  summary: 'Roadmap details are not available.',
  items: [],
  themes: [],
}

const sections = computed(() => props.deck.roadmap?.sections)
const activeStageIndex = computed(() => stageOrder.indexOf(props.slide.stage))
const timelineStages = computed(() =>
  stageOrder.map((status, index) => {
    let progressState: 'viewed' | 'current' | 'upcoming' = 'upcoming'

    if (index < activeStageIndex.value) {
      progressState = 'viewed'
    } else if (index === activeStageIndex.value) {
      progressState = 'current'
    }

    return {
      status,
      section: sections.value?.[status] ?? fallbackSection,
      isActive: status === props.slide.stage,
      progressState,
    }
  }),
)
const activeStage = computed(() => sections.value?.[props.slide.stage] ?? fallbackSection)
</script>

<template>
  <StandardSlideLayout
    :title="`Roadmap: ${activeStage.label}`"
    :subtitle="slide.subtitle ?? activeStage.summary"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :deck-subtitle="deck.subtitle"
    content-padding="50px 80px"
  >
    <div class="content-wrapper">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        <div class="milestones-container">
          <div
            v-for="entry in timelineStages"
            :key="entry.status"
            class="milestone-node"
            :class="[
              `milestone-node--${entry.progressState}`,
            ]"
          >
            <div class="node-circle"></div>
            <h3 class="milestone-title">{{ entry.section.label }}</h3>
            <p class="milestone-summary">{{ entry.section.summary }}</p>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <section class="detail-card detail-card--primary">
          <p class="card-eyebrow">{{ activeStage.label }}</p>
          <h2 class="card-title">Key deliverables</h2>
          <ul class="detail-list">
            <li v-for="item in activeStage.items" :key="item" class="detail-item">
              <FontAwesomeIcon icon="chevron-right" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section class="detail-card detail-card--secondary">
          <div class="section-header">
            <h2 class="section-title">
              <FontAwesomeIcon icon="bullseye" class="section-title__icon" />
              Focus areas
            </h2>
          </div>
          <div class="themes-grid">
            <div
              v-for="theme in activeStage.themes"
              :key="theme.category"
              class="theme-row"
            >
              <div class="theme-category">{{ theme.category }}</div>
              <div class="theme-target">
                <FontAwesomeIcon icon="chevron-right" />
                <p>{{ theme.target }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <a
        class="footer-link"
        :href="site.links.repository.url"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon :icon="['fab', 'github']" /> View full roadmap &amp; milestones on GitHub
      </a>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2rem;
}

.timeline-wrapper {
  position: relative;
  padding: 2rem 0 0.5rem;
}

.timeline-line {
  position: absolute;
  top: 3rem;
  right: 4rem;
  left: 4rem;
  border-top: 2px dashed #444455;
}

.milestones-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.milestone-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.55rem;
}

.node-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 0.35rem;
  border: 3px solid #333344;
  border-radius: 999px;
  background-color: #1e1e2e;
  color: #333344;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.node-circle::after {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.milestone-node--viewed .node-circle {
  border-color: #e8341c;
  background-color: rgba(232, 52, 28, 0.16);
}

.milestone-node--viewed .node-circle::after {
  background-color: #e8341c;
}

.milestone-node--current .node-circle {
  border-color: #e8341c;
  box-shadow: 0 0 0 6px rgba(232, 52, 28, 0.14);
  transform: scale(1.08);
}

.milestone-node--current .node-circle::after {
  width: 14px;
  height: 14px;
  background-color: #e8341c;
}

.milestone-node--upcoming .node-circle {
  border-color: #8888aa;
}

.milestone-title {
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.milestone-node--viewed .milestone-title {
  color: #d0d0e8;
}

.milestone-node--current .milestone-title {
  color: #e8341c;
}

.milestone-node--upcoming .milestone-title {
  color: #b4b8cb;
}

.milestone-summary {
  margin: 0;
  color: #8888aa;
  font-size: 0.82rem;
  line-height: 1.45;
  max-width: 14rem;
}

.details-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 1.5rem;
  flex: 1;
}

.detail-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 12px;
  background-color: #252535;
}

.detail-card--primary {
  padding: 1.75rem 1.75rem 1.5rem;
  border-left: 4px solid #e8341c;
}

.detail-card--secondary {
  padding: 1.5rem 1.75rem;
  border: 1px solid #333344;
}

.card-eyebrow {
  margin: 0 0 0.65rem;
  color: #e8341c;
  font: 600 0.82rem/1.2 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card-title {
  margin: 0 0 1.25rem;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 600;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.detail-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: #d0d0e8;
}

.detail-item :deep(svg) {
  margin-top: 0.28rem;
  color: #e8341c;
  flex-shrink: 0;
}

.section-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333344;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0;
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 600;
}

.section-title__icon {
  color: #e8341c;
}

.themes-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 0.9rem 1.1rem;
}

.theme-row {
  display: contents;
}

.theme-category {
  padding: 0.85rem 0;
  border-bottom: 1px solid #333344;
  color: #e8341c;
  font: 500 0.85rem/1.4 var(--font-mono);
}

.theme-target {
  display: flex;
  gap: 0.7rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #333344;
  color: #d0d0e8;
}

.theme-target :deep(svg) {
  margin-top: 0.3rem;
  color: #555577;
  flex-shrink: 0;
}

.theme-target p {
  margin: 0;
}

.theme-row:last-child .theme-category,
.theme-row:last-child .theme-target {
  border-bottom: none;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  align-self: flex-end;
  margin-top: auto;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  background-color: rgba(37, 37, 53, 0.92);
  color: #8888aa;
  font-size: 0.875rem;
  text-decoration: none;
}

.footer-link:hover {
  color: #d0d0e8;
  background-color: rgba(232, 52, 28, 0.08);
}

@media (max-width: 1199px) {
  .milestones-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 1.5rem;
  }

  .timeline-line {
    display: none;
  }
}

@media (max-width: 959px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .content-wrapper {
    gap: 1.5rem;
  }

  .milestones-container,
  .themes-grid {
    grid-template-columns: 1fr;
  }

  .detail-card--primary,
  .detail-card--secondary {
    padding: 1.25rem;
  }

  .footer-link {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
