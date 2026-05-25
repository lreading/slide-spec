<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import FaIcon from '../ui/FaIcon.vue'
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

const mentionFaIcons = ['fa-microphone-alt', 'fa-rss', 'fa-podcast']
const statFaIcons = ['fa-star', 'fa-check-circle', 'fa-code-branch', 'fa-user-plus']

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

function getTrendDirection(delta: number): 'up' | 'down' {
  return delta < 0 ? 'down' : 'up'
}

const stats = computed(() =>
  props.slide.content.stat_keys.map((key, index) => ({
    ...props.generated.stats[key],
    faIcon: props.slide.content.stat_fa_icons?.[index] ?? statFaIcons[index] ?? 'fa-star',
    trendDirection: getTrendDirection(props.generated.stats[key].delta),
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
    faIcon: mention.fa_icon ?? mentionFaIcons[index] ?? 'fa-rss',
    linkFaIcon: mention.link_fa_icon ?? 'fa-external-link-alt',
    isLinked: Boolean(mention.url),
  })),
)
const sectionHeadingFaIcon = computed(() => props.slide.content.section_heading_fa_icon ?? 'fa-bullhorn')
const statsHeadingFaIcon = computed(() => props.slide.content.stats_heading_fa_icon ?? 'fa-chart-line')
const trendUpFaIcon = computed(() => props.slide.content.trend_up_fa_icon ?? 'fa-arrow-up')
const trendDownFaIcon = computed(() => props.slide.content.trend_down_fa_icon ?? 'fa-arrow-down')
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
          :fa-icon="sectionHeadingFaIcon"
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
            <div class="mention-type"><FaIcon :fa-icon="mention.faIcon" /> {{ mention.type }}</div>
            <h3 class="mention-title">{{ mention.title }}</h3>
            <div v-if="mention.url && mention.url_label" class="mention-link">
              <FaIcon :fa-icon="mention.linkFaIcon" /> {{ mention.url_label }}
            </div>
          </SurfaceCard>
        </div>
      </div>

      <div class="right-column">
        <SectionHeading
          v-if="slide.content.stats_heading"
          :fa-icon="statsHeadingFaIcon"
          :title="slide.content.stats_heading"
        />
        <div class="stats-grid">
          <MetricStatCard
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
            :fa-icon="stat.faIcon"
            :value="stat.current.toLocaleString()"
            :label="stat.label"
            :trend="stat.trend"
            :trend-direction="stat.trendDirection"
            :trend-up-fa-icon="trendUpFaIcon"
            :trend-down-fa-icon="trendDownFaIcon"
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
