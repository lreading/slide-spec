<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import MetricStatCard from '../ui/MetricStatCard.vue'
import SectionHeading from '../ui/SectionHeading.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type {
  CommunityHighlightsSlide,
  GeneratedPresentationData,
  PresentationContent,
} from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  generated: GeneratedPresentationData
  slide: CommunityHighlightsSlide
  slideNumber: number
  slideTotal: number
}>()

const mentionIcons = ['microphone-alt', 'rss', 'podcast']
const statIcons = ['star', 'check-circle', 'code-branch', 'user-plus']

function formatTrendLabel(
  previous: number,
  delta: number,
  trendSuffix?: string,
): string | undefined {
  if (delta === 0) {
    return undefined
  }

  const suffix = trendSuffix?.trim()

  if (previous > 0) {
    const percent = Math.round((Math.abs(delta) / previous) * 100)
    const direction = delta > 0 ? '+' : '-'
    return suffix ? `${direction}${percent}% ${suffix}` : `${direction}${percent}%`
  }

  const direction = delta > 0 ? '+' : '-'
  return suffix ? `${direction}${Math.abs(delta)} ${suffix}` : `${direction}${Math.abs(delta)}`
}

const stats = computed(() =>
  props.slide.content.stat_keys.map((key, index) => ({
    ...props.generated.stats[key],
    icon: statIcons[index],
    trend: props.slide.content.show_deltas === false
      ? undefined
      : formatTrendLabel(
          props.generated.stats[key].previous,
          props.generated.stats[key].delta,
          props.slide.content.trend_suffix,
        ),
  })),
)

const mentionCards = computed(() =>
  props.slide.content.mentions.map((mention, index) => ({
    ...mention,
    icon: mentionIcons[index] ?? 'rss',
    isLinked: Boolean(mention.url),
  })),
)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <div class="content-grid">
      <div class="left-column">
        <SectionHeading
          v-if="slide.content.section_heading"
          :icon="'bullhorn'"
          :title="slide.content.section_heading"
        />
        <div class="mentions-list">
          <SurfaceCard
            v-for="mention in mentionCards"
            :key="mention.title"
            class="mention-card"
            :href="mention.url"
            :interactive="mention.isLinked"
            hover-shift="x"
            accent="left"
            accent-visibility="hover"
            radius="md"
            padding="20px"
          >
            <div class="mention-type"><FontAwesomeIcon :icon="mention.icon" /> {{ mention.type }}</div>
            <h3 class="mention-title">{{ mention.title }}</h3>
            <div v-if="mention.url && mention.url_label" class="mention-link">
              <FontAwesomeIcon icon="external-link-alt" /> {{ mention.url_label }}
            </div>
          </SurfaceCard>
        </div>
      </div>

      <div class="right-column">
        <SectionHeading
          v-if="slide.content.stats_heading"
          :icon="'chart-line'"
          :title="slide.content.stats_heading"
        />
        <div class="stats-grid">
          <MetricStatCard
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
            :icon="stat.icon"
            :value="stat.current.toLocaleString()"
            :label="stat.label"
            :trend="stat.trend"
          />
        </div>
      </div>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  flex: 1;
}

.mentions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mention-card {
  display: flex;
  flex-direction: column;
}

.mention-type {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  color: #e8341c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.mention-type i {
  margin-right: 6px;
}

.mention-title {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 8px;
  line-height: 1.4;
}

.mention-link {
  font-size: 13px;
  color: #8888aa;
  display: flex;
  align-items: center;
  margin-top: auto;
}

.mention-link i {
  margin-right: 6px;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-content: start;
}

@media (max-width: 959px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
