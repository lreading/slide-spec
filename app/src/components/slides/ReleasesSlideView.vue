<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type { GeneratedPresentationData, PresentationDeck, ReleasesSlide } from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  generated: GeneratedPresentationData
  slide: ReleasesSlide
  slideNumber: number
}>()

const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
const releases = computed(() =>
  props.generated.releases.filter((release) => props.slide.featured_release_ids.includes(release.id)),
)
</script>

<template>
  <StandardSlideLayout
    title="Releases"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
  >
    <div class="timeline-container">
      <div class="timeline-line"></div>
      <div v-for="(release, index) in releases" :key="release.id" class="release-card" :class="{ latest: index === 0 }">
        <div class="timeline-node"></div>
        <div class="card-header">
          <div class="flex items-center">
            <span class="version-badge">
              <FontAwesomeIcon :icon="index === 0 ? 'tag' : 'code-branch'" />{{ release.version }}
            </span>
            <span v-if="index === 0" class="latest-tag">Latest</span>
          </div>
          <span class="release-date">{{ formatter.format(new Date(release.published_at)) }}</span>
        </div>
        <ul class="changelog-list">
          <li v-for="item in release.summary_bullets" :key="item" class="changelog-item">{{ item }}</li>
        </ul>
      </div>

      <div class="cta-container">
        <a class="github-link" href="https://github.com/OWASP/threat-dragon/releases" target="_blank" rel="noreferrer">
          <FontAwesomeIcon :icon="['fab', 'github']" /> View all releases on GitHub
        </a>
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

.release-card {
  background-color: #252535;
  border-radius: 8px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 20px;
  border-left: 4px solid #333344;
  transition:
    transform 0.2s,
    border-color 0.2s;
  margin-left: 20px;
}

.release-card:hover {
  border-left-color: #e8341c;
  transform: translateX(5px);
  background-color: #2a2a3e;
}

.release-card.latest {
  border-left-color: #e8341c;
  background-color: rgba(232, 52, 28, 0.03);
  border: 1px solid rgba(232, 52, 28, 0.2);
  border-left: 4px solid #e8341c;
}

.timeline-node {
  position: absolute;
  left: -28px;
  top: 24px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #1e1e2e;
  border: 3px solid #333344;
  z-index: 1;
}

.release-card:hover .timeline-node {
  border-color: #e8341c;
}

.release-card.latest .timeline-node {
  border-color: #e8341c;
  background-color: #e8341c;
  box-shadow: 0 0 0 4px rgba(232, 52, 28, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 16px;
}

.version-badge {
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.version-badge i {
  color: #e8341c;
  margin-right: 10px;
  font-size: 16px;
}

.release-date {
  font-size: 14px;
  color: #8888aa;
  font-family: 'Roboto Mono', monospace;
}

.latest-tag {
  background-color: #e8341c;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.changelog-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.changelog-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 6px;
  color: #d0d0e8;
  font-size: 14px;
  line-height: 1.5;
}

.changelog-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #555577;
  font-weight: bold;
}

.release-card:hover .changelog-item::before,
.release-card.latest .changelog-item::before {
  color: #e8341c;
}

.cta-container {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.github-link {
  color: #8888aa;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #252535;
  border: 1px solid #333344;
}

.github-link:hover {
  color: #ffffff;
  border-color: #555577;
  background-color: #2a2a3e;
}

.github-link i {
  margin-right: 8px;
}
</style>
