<script setup lang="ts">
export type ProgressTimelineState = 'viewed' | 'current' | 'upcoming'

export interface ProgressTimelineItem {
  key: string
  title: string
  summary: string
  state: ProgressTimelineState
}

defineProps<{
  items: ProgressTimelineItem[]
}>()
</script>

<template>
  <div class="progress-timeline">
    <div class="progress-timeline__line"></div>
    <div
      class="progress-timeline__items"
      :style="{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }"
    >
      <div
        v-for="item in items"
        :key="item.key"
        class="progress-timeline__item"
        :class="`progress-timeline__item--${item.state}`"
      >
        <div class="progress-timeline__node"></div>
        <h3 class="progress-timeline__title">{{ item.title }}</h3>
        <p class="progress-timeline__summary">{{ item.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-timeline {
  position: relative;
  padding: 2rem 0 0.5rem;
}

.progress-timeline__line {
  position: absolute;
  top: 3rem;
  right: 4rem;
  left: 4rem;
  border-top: 2px dashed #444455;
}

.progress-timeline__items {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
}

.progress-timeline__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  text-align: center;
}

.progress-timeline__node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 0.35rem;
  border: 3px solid #333344;
  border-radius: 999px;
  background-color: #1e1e2e;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.progress-timeline__node::after {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background-color: transparent;
  transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
}

.progress-timeline__item--viewed .progress-timeline__node {
  border-color: #e8341c;
  background-color: rgba(232, 52, 28, 0.16);
}

.progress-timeline__item--viewed .progress-timeline__node::after {
  background-color: #e8341c;
}

.progress-timeline__item--current .progress-timeline__node {
  border-color: #e8341c;
  box-shadow: 0 0 0 6px rgba(232, 52, 28, 0.14);
  transform: scale(1.08);
}

.progress-timeline__item--current .progress-timeline__node::after {
  width: 14px;
  height: 14px;
  background-color: #e8341c;
}

.progress-timeline__item--upcoming .progress-timeline__node {
  border-color: #8888aa;
}

.progress-timeline__title {
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.progress-timeline__item--viewed .progress-timeline__title {
  color: #d0d0e8;
}

.progress-timeline__item--current .progress-timeline__title {
  color: #e8341c;
}

.progress-timeline__item--upcoming .progress-timeline__title {
  color: #b4b8cb;
}

.progress-timeline__summary {
  max-width: 14rem;
  margin: 0;
  color: #8888aa;
  font-size: 0.82rem;
  line-height: 1.45;
}

@media (max-width: 1199px) {
  .progress-timeline__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 1.5rem;
  }

  .progress-timeline__line {
    display: none;
  }
}

@media (max-width: 767px) {
  .progress-timeline__items {
    grid-template-columns: 1fr;
  }
}
</style>
