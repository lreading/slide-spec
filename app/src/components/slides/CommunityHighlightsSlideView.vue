<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import MetricStatCard from '../ui/MetricStatCard.vue'
import SectionHeading from '../ui/SectionHeading.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type {
  CommunityHighlightsSlide,
  GeneratedPresentationData,
  PresentationDeck,
} from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  generated: GeneratedPresentationData
  slide: CommunityHighlightsSlide
  slideNumber: number
  slideTotal: number
}>()

const mentionIcons = ['microphone-alt', 'rss', 'podcast']
const statIcons = ['star', 'check-circle', 'code-branch', 'user-plus']
const trendLabels = ['+12% vs last Q', '+8% vs last Q', '+15% vs last Q', '+5 vs last Q']

const stats = computed(() =>
  props.slide.stat_keys.map((key, index) => ({
    ...props.generated.stats[key],
    icon: statIcons[index],
    trend: trendLabels[index],
  })),
)

const mentionCards = computed(() =>
  props.slide.mentions.map((mention, index) => ({
    ...mention,
    icon: mentionIcons[index] ?? 'rss',
    isLinked: Boolean(mention.url),
  })),
)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title ?? 'Community Highlights'"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :deck-subtitle="deck.subtitle"
  >
    <div class="content-grid">
      <div class="left-column">
        <SectionHeading :icon="'bullhorn'" :title="slide.section_heading ?? 'Community Activity'" />
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
        <SectionHeading :icon="'chart-line'" title="Stats This Quarter" />
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
