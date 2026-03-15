<script setup lang="ts">
import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type { PresentationDeck, RoadmapSlide } from '../../types/content'

defineProps<{
  deck: PresentationDeck
  slide: RoadmapSlide
  slideNumber: number
}>()
</script>

<template>
  <StandardSlideLayout
    title="Roadmap"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
    content-padding="50px 80px"
  >
    <div class="content-wrapper">
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        <div class="milestones-container">
          <div
            v-for="milestone in slide.milestones"
            :key="milestone.label"
            class="milestone-node"
            :class="`status-${milestone.status.replace('-', '')}`"
          >
            <div class="node-circle">
              <FontAwesomeIcon v-if="milestone.status === 'completed'" icon="check" />
            </div>
            <h3 class="milestone-title">{{ milestone.label }}</h3>
            <div class="milestone-items">
              <p v-for="item in milestone.items" :key="item">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="themes-section">
        <div class="section-header">
          <h2 class="section-title"><FontAwesomeIcon icon="bullseye" class="mr-2 text-[#e8341c]" />Strategic Themes &amp; Targets</h2>
        </div>
        <div class="themes-grid">
          <div v-for="theme in slide.themes" :key="theme.category" class="theme-row">
            <div class="theme-category">{{ theme.category }}</div>
            <div class="theme-target">
              <FontAwesomeIcon icon="chevron-right" />
              <p>{{ theme.target }}</p>
            </div>
          </div>
        </div>
      </div>

      <a class="footer-link" href="https://github.com/OWASP/threat-dragon" target="_blank" rel="noreferrer">
        <FontAwesomeIcon :icon="['fab', 'github']" /> View full roadmap &amp; milestones on GitHub
      </a>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.timeline-wrapper {
  position: relative;
  padding: 40px 0 20px;
  margin-bottom: 10px;
}

.timeline-line {
  position: absolute;
  top: 55px;
  left: 50px;
  right: 50px;
  border-top: 2px dashed #444455;
}

.milestones-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  gap: 12px;
}

.milestone-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  text-align: center;
}

.node-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1e1e2e;
  border: 3px solid #333344;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333344;
  transition: all 0.3s ease;
  position: relative;
}

.node-circle i {
  font-size: 14px;
}

.status-completed .node-circle {
  border-color: #e8341c;
  background-color: #e8341c;
  color: white;
  box-shadow: 0 0 0 4px rgba(232, 52, 28, 0.15);
}

.status-inprogress .node-circle {
  border-color: #e8341c;
  background-color: #1e1e2e;
  color: #e8341c;
}

.status-inprogress .node-circle::after {
  content: '';
  width: 14px;
  height: 14px;
  background-color: #e8341c;
  border-radius: 50%;
}

.status-planned .node-circle {
  border-color: #8888aa;
}

.status-future .node-circle {
  border-color: #444455;
  border-style: dashed;
}

.milestone-title {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  margin: 0 0 8px;
}

.status-completed .milestone-title {
  color: #e8341c;
}

.status-planned .milestone-title {
  color: #d0d0e8;
}

.status-future .milestone-title {
  color: #8888aa;
}

.milestone-items {
  font-size: 13px;
  color: #8888aa;
  line-height: 1.4;
}

.milestone-items p {
  margin: 0;
}

.themes-section {
  background-color: #252535;
  border-radius: 8px;
  padding: 25px;
  border-left: 4px solid #e8341c;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333344;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.themes-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}

.theme-row {
  display: contents;
}

.theme-category {
  font-family: 'Roboto Mono', monospace;
  color: #e8341c;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #333344;
}

.theme-target {
  color: #d0d0e8;
  font-size: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #333344;
  display: flex;
  align-items: center;
}

.theme-target i {
  margin-right: 10px;
  color: #555577;
  font-size: 12px;
}

.theme-target p {
  margin: 0;
}

.theme-row:last-child .theme-category,
.theme-row:last-child .theme-target {
  border-bottom: none;
}

.footer-link {
  margin-top: auto;
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  color: #8888aa;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #252535;
  border: 1px solid #333344;
  transition: all 0.2s;
}

.footer-link:hover {
  color: #ffffff;
  background-color: #2a2a3e;
  border-color: #555577;
}

.footer-link i {
  margin-right: 8px;
}

@media (max-width: 959px) {
  .milestones-container,
  .themes-grid {
    grid-template-columns: 1fr;
    display: grid;
  }

  .milestone-node {
    width: auto;
  }
}
</style>
