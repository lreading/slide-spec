<script setup lang="ts">
import ContentList from './ContentList.vue'
import FaIcon from './FaIcon.vue'
import SurfaceCard from './SurfaceCard.vue'

defineProps<{
  href: string
  label: string
  labelFaIcon: string
  date: string
  items: string[]
  highlighted?: boolean
  badgeLabel?: string
}>()
</script>

<template>
  <SurfaceCard
    class="timeline-event-card"
    :href="href"
    :interactive="true"
    hover-shift="x"
    accent="left"
    :accent-visibility="highlighted ? 'always' : 'hover'"
    accent-size="4px"
    radius="md"
    padding="20px 24px"
    :background="highlighted ? 'rgba(232, 52, 28, 0.03)' : '#252535'"
    hover-background="#2a2a3e"
  >
    <div class="timeline-event-card__node" :class="{ 'timeline-event-card__node--highlighted': highlighted }"></div>
    <div class="timeline-event-card__header">
      <div class="timeline-event-card__label-group">
        <span class="timeline-event-card__label">
          <FaIcon :fa-icon="labelFaIcon" class="timeline-event-card__label-icon" />
          {{ label }}
        </span>
        <span v-if="badgeLabel" class="timeline-event-card__badge">{{ badgeLabel }}</span>
      </div>
      <span class="timeline-event-card__date">{{ date }}</span>
    </div>
    <ContentList
      class="timeline-event-card__list"
      :items="items"
      marker="bullet"
      :marker-color="highlighted ? '#e8341c' : '#555577'"
      gap="0.35rem"
    />
  </SurfaceCard>
</template>

<style scoped>
.timeline-event-card {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-left: 20px;
}

.timeline-event-card__node {
  position: absolute;
  top: 24px;
  left: -28px;
  width: 16px;
  height: 16px;
  border: 3px solid #333344;
  border-radius: 999px;
  background-color: #1e1e2e;
  z-index: 1;
}

.timeline-event-card__node--highlighted {
  border-color: #e8341c;
  background-color: #e8341c;
  box-shadow: 0 0 0 4px rgba(232, 52, 28, 0.2);
}

:deep(.timeline-event-card:hover .timeline-event-card__node) {
  border-color: #e8341c;
}

.timeline-event-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.timeline-event-card__label-group {
  display: flex;
  align-items: center;
}

.timeline-event-card__label {
  display: flex;
  align-items: center;
  color: #ffffff;
  font: 700 18px/1 var(--font-mono);
}

.timeline-event-card__label-icon {
  margin-right: 10px;
  color: #e8341c;
  font-size: 16px;
}

.timeline-event-card__date {
  color: #8888aa;
  font: 400 14px/1.4 var(--font-mono);
}

.timeline-event-card__badge {
  margin-left: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #e8341c;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
