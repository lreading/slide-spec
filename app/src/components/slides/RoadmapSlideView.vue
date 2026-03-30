<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import ContentList from '../ui/ContentList.vue'
import FooterActionLink from '../ui/FooterActionLink.vue'
import KeyValueRows from '../ui/KeyValueRows.vue'
import ProgressTimeline from '../ui/ProgressTimeline.vue'
import SectionHeading from '../ui/SectionHeading.vue'
import { resolveRoadmapLabels } from '../../content/contentDefaults'

import type {
  PresentationContent,
  RoadmapSlide,
  RoadmapStageStatus,
  SiteContent,
} from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  site: SiteContent
  slide: RoadmapSlide
  slideNumber: number
  slideTotal: number
}>()

const stageOrder: RoadmapStageStatus[] = ['completed', 'in-progress', 'planned', 'future']
const stages = computed(() => props.slide.content.stages)
const activeStageIndex = computed(() => stageOrder.indexOf(props.slide.content.stage))
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
      stage: stages.value?.[status],
      progressState,
    }
  }),
)
const activeStage = computed(() => stages.value?.[props.slide.content.stage])
const roadmapLabels = computed(() => resolveRoadmapLabels(props.slide.content))
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle ?? activeStage?.summary"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
    content-padding="50px 80px"
  >
    <div class="content-wrapper">
      <ProgressTimeline
        :items="timelineStages.map((entry) => ({
          key: entry.status,
          title: entry.stage?.label ?? '',
          summary: entry.stage?.summary ?? '',
          state: entry.progressState,
        }))"
      />

      <div class="details-grid">
        <section class="detail-card detail-card--primary">
          <p v-if="activeStage?.label" class="card-eyebrow">{{ activeStage.label }}</p>
          <h2 v-if="roadmapLabels.deliverables" class="card-title">{{ roadmapLabels.deliverables }}</h2>
          <ContentList :items="slide.content.items" marker="icon" icon="chevron-right" class="detail-list" />
        </section>

        <section class="detail-card detail-card--secondary">
          <SectionHeading v-if="roadmapLabels.focusAreas" icon="bullseye" :title="roadmapLabels.focusAreas" />
          <KeyValueRows
            :rows="slide.content.themes.map((theme) => ({ key: theme.category, value: theme.target }))"
            class="themes-grid"
          />
        </section>
      </div>

      <FooterActionLink
        v-if="roadmapLabels.footerLink"
        class="footer-link"
        :href="site.links.repository.url"
        :icon="['fab', 'github']"
        :label="roadmapLabels.footerLink"
      />
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

@media (max-width: 1199px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .content-wrapper {
    gap: 1.5rem;
  }

  .detail-card--primary,
  .detail-card--secondary {
    padding: 1.25rem;
  }
}
</style>
