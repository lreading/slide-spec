<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import FaIcon from '../ui/FaIcon.vue'
import FooterActionLink from '../ui/FooterActionLink.vue'
import KeyValueRows from '../ui/KeyValueRows.vue'
import ProgressTimeline from '../ui/ProgressTimeline.vue'
import RichText from '../ui/RichText.vue'
import type {
  PresentationContent,
  RoadmapSlide,
  SiteContent,
} from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  site: SiteContent
  slide: RoadmapSlide
  slideNumber: number
  slideTotal: number
}>()

const stages = computed(() => props.slide.content.stages)
const stageOrder = computed(() => Object.keys(stages.value))
const activeStageIndex = computed(() => stageOrder.value.indexOf(props.slide.content.stage))
const timelineStages = computed(() =>
  stageOrder.value.map((status, index) => {
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
const footerLinkFaIcon = computed(() => props.slide.content.footer_link_fa_icon ?? 'fa-github')
const footerLinkLabel = computed(() => {
  const label = props.slide.content.footer_link_label?.trim()
  return label && label.length > 0 ? label : undefined
})
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

      <div class="details-grid" :style="{ '--progress-detail-columns': String(slide.content.sections.length) }">
        <section
          v-for="(section, index) in slide.content.sections"
          class="detail-card"
          :key="`${section.type}-${section.title ?? index}`"
        >
          <h2 v-if="section.title" class="card-title">
            <FaIcon v-if="section.fa_icon" :fa-icon="section.fa_icon" class="card-title__icon" />
            <span>{{ section.title }}</span>
          </h2>
          <RichText v-if="section.type === 'richtext'" :text="section.body" class="detail-rich-text" />
          <KeyValueRows
            v-else
            :rows="section.body"
            :value-fa-icon="section.separator_fa_icon ?? 'fa-chevron-right'"
            class="themes-grid"
          />
        </section>
      </div>

      <FooterActionLink
        v-if="footerLinkLabel"
        class="footer-link"
        :href="site.links.repository.url"
        :fa-icon="footerLinkFaIcon"
        :label="footerLinkLabel"
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
  grid-template-columns: repeat(var(--progress-detail-columns), minmax(0, 1fr));
  gap: 1.5rem;
  flex: 1;
}
.detail-card {
  display: grid;
  align-content: flex-start;
  min-height: 0;
  padding: 1.5rem 1.75rem;
  border-radius: 12px;
  border: 1px solid #333344;
  background-color: #252535;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.25rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid #333344;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
}
.card-title__icon {
  color: #e8341c;
  flex-shrink: 0;
}
.detail-rich-text {
  color: #d0d0e8;
  line-height: 1.5;
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
  .detail-card {
    padding: 1.25rem;
  }
}
</style>
