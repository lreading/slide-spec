<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import SectionHeading from '../ui/SectionHeading.vue'

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
    title="Community Highlights"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :deck-subtitle="deck.subtitle"
  >
    <div class="content-grid">
      <div class="left-column">
        <SectionHeading :icon="'bullhorn'" :title="slide.section_heading ?? 'Community Activity'" />
        <div class="mentions-list">
          <component
            :is="mention.isLinked ? 'a' : 'div'"
            v-for="mention in mentionCards"
            :key="mention.title"
            class="mention-card"
            :class="{ 'mention-card--linked': mention.isLinked }"
            :href="mention.url"
            :target="mention.isLinked ? '_blank' : undefined"
            :rel="mention.isLinked ? 'noreferrer' : undefined"
          >
            <div class="mention-type"><FontAwesomeIcon :icon="mention.icon" /> {{ mention.type }}</div>
            <h3 class="mention-title">{{ mention.title }}</h3>
            <div v-if="mention.url && mention.url_label" class="mention-link">
              <FontAwesomeIcon icon="external-link-alt" /> {{ mention.url_label }}
            </div>
          </component>
        </div>
      </div>

      <div class="right-column">
        <SectionHeading :icon="'chart-line'" title="Stats This Quarter" />
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-icon">
              <FontAwesomeIcon :icon="stat.icon" />
            </div>
            <p class="stat-value">{{ stat.current.toLocaleString() }}</p>
            <p class="stat-label">{{ stat.label }}</p>
            <div class="trend-indicator">
              <FontAwesomeIcon icon="arrow-up" /> {{ stat.trend }}
            </div>
          </div>
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
  background-color: #252535;
  border-radius: 8px;
  padding: 20px;
  border-left: 3px solid #333344;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.mention-card--linked {
  cursor: pointer;
}

.mention-card--linked:hover {
  border-left-color: #e8341c;
  background-color: #2a2a3e;
  transform: translateX(5px);
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

.stat-card {
  background-color: #252535;
  border-radius: 8px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid #333344;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: #e8341c;
  background-color: #2a2a3e;
  transform: translateY(-5px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(232, 52, 28, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #e8341c;
  font-size: 20px;
}

.stat-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 5px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8888aa;
  margin: 0;
}

.trend-indicator {
  font-size: 12px;
  color: #4ade80;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.trend-indicator i {
  margin-right: 4px;
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
