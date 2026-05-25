<script setup lang="ts">
import FaIcon from './FaIcon.vue'
import IconBadge from './IconBadge.vue'
import SurfaceCard from './SurfaceCard.vue'

defineProps<{
  faIcon: string
  value: string
  label: string
  trend?: string
  trendDirection?: 'up' | 'down'
  trendUpFaIcon?: string
  trendDownFaIcon?: string
}>()
</script>

<template>
  <SurfaceCard
    class="metric-stat-card"
    :interactive="true"
    hover-shift="y"
    radius="md"
    padding="25px 20px"
  >
    <IconBadge :fa-icon="faIcon" class="metric-stat-card__icon" size="48px" icon-size="20px" />
    <p class="metric-stat-card__value">{{ value }}</p>
    <p class="metric-stat-card__label">{{ label }}</p>
    <div
      v-if="trend"
      class="metric-stat-card__trend"
      :class="{
      'metric-stat-card__trend--down': trendDirection === 'down',
      }"
    >
      <FaIcon :fa-icon="trendDirection === 'down' ? trendDownFaIcon ?? 'fa-arrow-down' : trendUpFaIcon ?? 'fa-arrow-up'" />
      <span>{{ trend }}</span>
    </div>
  </SurfaceCard>
</template>

<style scoped>
.metric-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-stat-card__icon {
  margin-bottom: 15px;
}

.metric-stat-card__value {
  margin: 0 0 5px;
  color: #ffffff;
  font: 700 36px/1 var(--font-mono);
}

.metric-stat-card__label {
  margin: 0;
  color: #8888aa;
  font-size: 14px;
}

.metric-stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #4ade80;
  font-size: 12px;
}

.metric-stat-card__trend--down {
  color: #f87171;
}
</style>
