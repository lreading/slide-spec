<script setup lang="ts">
import FaIcon from './FaIcon.vue'
import RichText from './RichText.vue'

const props = withDefaults(
  defineProps<{
    items: string[]
    marker?: 'icon' | 'bullet'
    faIcon?: string
    markerColor?: string
    gap?: string
    itemPaddingLeft?: string
  }>(),
  {
    marker: 'bullet',
    faIcon: 'fa-chevron-right',
    markerColor: '#e8341c',
    gap: '0.9rem',
    itemPaddingLeft: '20px',
  },
)
</script>

<template>
  <ul
    class="content-list"
    :style="{
      '--content-list-gap': props.gap,
      '--content-list-marker-color': props.markerColor,
      '--content-list-padding-left': props.itemPaddingLeft,
    }"
  >
    <li v-for="item in items" :key="item" class="content-list__item" :class="`content-list__item--${marker}`">
      <FaIcon v-if="marker === 'icon'" :fa-icon="faIcon" class="content-list__icon" />
      <RichText :text="item" class="content-list__text" />
    </li>
  </ul>
</template>

<style scoped>
.content-list {
  display: flex;
  flex-direction: column;
  gap: var(--content-list-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

.content-list__item {
  color: #d0d0e8;
}

.content-list__item--icon {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.content-list__icon {
  margin-top: 0.28rem;
  color: var(--content-list-marker-color);
  flex-shrink: 0;
}

.content-list__text {
  min-width: 0;
}

.content-list__item--bullet {
  position: relative;
  padding-left: var(--content-list-padding-left);
  font-size: 14px;
  line-height: 1.5;
}

.content-list__item--bullet::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--content-list-marker-color);
  font-weight: bold;
}
</style>
