<script setup lang="ts">
import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import IconBadge from '../ui/IconBadge.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type { PresentationDeck, RecentUpdatesSlide } from '../../types/content'

defineProps<{
  deck: PresentationDeck
  slide: RecentUpdatesSlide
  slideNumber: number
  slideTotal: number
}>()

const icons = ['wrench', 'star', 'users']
</script>

<template>
  <StandardSlideLayout
    :title="slide.title ?? 'What Happened Since Last Update'"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :deck-subtitle="deck.subtitle"
  >
    <div class="feature-grid">
      <SurfaceCard
        v-for="(section, index) in slide.sections"
        :key="section.title"
        class="feature-card"
        accent="left"
        accent-visibility="always"
        :border="false"
        radius="md"
        padding="30px"
      >
        <IconBadge :icon="icons[index]" class="icon-container" />
        <h2 class="card-title">{{ section.title }}</h2>
        <ul class="bullet-list">
          <li v-for="bullet in section.bullets" :key="bullet" class="bullet-item">{{ bullet }}</li>
        </ul>
      </SurfaceCard>
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
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.icon-container {
  margin-bottom: 20px;
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
