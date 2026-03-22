<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import FooterActionLink from '../ui/FooterActionLink.vue'
import TimelineEventCard from '../ui/TimelineEventCard.vue'

import type {
  GeneratedPresentationData,
  PresentationContent,
  ReleasesSlide,
  SiteContent,
} from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  generated: GeneratedPresentationData
  site: SiteContent
  slide: ReleasesSlide
  slideNumber: number
  slideTotal: number
}>()

const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
const releases = computed(() =>
  props.generated.releases
    .filter((release) => props.slide.content.featured_release_ids.includes(release.id))
    .map((release) => ({
      ...release,
      githubUrl: release.url || `${props.site.links.repository.url}/releases/tag/${release.version}`,
    })),
)
const releasesUrl = computed(() => `${props.site.links.repository.url}/releases`)
const hasReleases = computed(() => releases.value.length > 0)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <div class="timeline-container">
      <template v-if="hasReleases">
        <div class="timeline-line"></div>
        <TimelineEventCard
          v-for="(release, index) in releases"
          :key="release.id"
          class="release-card"
          :href="release.githubUrl"
          :label="release.version"
          :label-icon="index === 0 ? 'tag' : 'code-branch'"
          :date="formatter.format(new Date(release.published_at))"
          :items="release.summary_bullets"
          :highlighted="index === 0"
          :badge-label="index === 0 ? slide.content.latest_badge_label : undefined"
        />
      </template>
      <div
        v-else-if="slide.content.empty_state_title || slide.content.empty_state_message"
        class="empty-state"
      >
        <h2 v-if="slide.content.empty_state_title" class="empty-state__title">
          {{ slide.content.empty_state_title }}
        </h2>
        <p v-if="slide.content.empty_state_message" class="empty-state__message">
          {{ slide.content.empty_state_message }}
        </p>
      </div>

      <div v-if="slide.content.footer_link_label" class="cta-container">
        <FooterActionLink
          class="github-link"
          :href="releasesUrl"
          :icon="['fab', 'github']"
          :label="slide.content.footer_link_label"
        />
      </div>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.timeline-container {
  position: relative;
  padding-left: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.timeline-line {
  position: absolute;
  left: 7px;
  top: 15px;
  bottom: 30px;
  width: 2px;
  background-color: #333344;
  z-index: 0;
}

.empty-state {
  margin: auto 0;
  padding: 2rem;
  border: 1px dashed #333344;
  border-radius: 16px;
  background: rgba(37, 37, 53, 0.85);
}

.empty-state__title {
  margin: 0 0 0.75rem;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-state__message {
  margin: 0;
  color: #b7b7d4;
  font-size: 1rem;
  line-height: 1.7;
}

.cta-container {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

</style>
