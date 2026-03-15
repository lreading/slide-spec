<script setup lang="ts">
import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type { PresentationDeck, RecentUpdatesSlide } from '../../types/content'

defineProps<{
  deck: PresentationDeck
  slide: RecentUpdatesSlide
  slideNumber: number
}>()

const icons = ['wrench', 'star', 'users']
</script>

<template>
  <StandardSlideLayout
    title="What Happened Since Last Update"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
  >
    <div class="feature-grid">
      <div v-for="(section, index) in slide.sections" :key="section.title" class="feature-card">
        <div class="icon-container">
          <FontAwesomeIcon :icon="icons[index]" />
        </div>
        <h2 class="card-title">{{ section.title }}</h2>
        <ul class="bullet-list">
          <li v-for="bullet in section.bullets" :key="bullet" class="bullet-item">{{ bullet }}</li>
        </ul>
      </div>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  flex: 1;
}

.feature-card {
  background-color: #252535;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  border-left: 3px solid #e8341c;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.icon-container {
  width: 60px;
  height: 60px;
  background-color: rgba(232, 52, 28, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid rgba(232, 52, 28, 0.2);
}

.icon-container i {
  font-size: 24px;
  color: #e8341c;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333344;
}

.bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.bullet-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 12px;
  color: #d0d0e8;
  font-size: 16px;
  line-height: 1.5;
}

.bullet-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #e8341c;
  font-weight: bold;
}

@media (max-width: 959px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
