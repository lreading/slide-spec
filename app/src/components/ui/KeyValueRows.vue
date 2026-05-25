<script setup lang="ts">
import FaIcon from './FaIcon.vue'

export interface KeyValueRow {
  key: string
  value: string
}

withDefaults(
  defineProps<{
    rows: KeyValueRow[]
    valueFaIcon?: string
  }>(),
  {
    valueFaIcon: 'fa-chevron-right',
  },
)
</script>

<template>
  <div class="key-value-rows">
    <div v-for="row in rows" :key="row.key" class="key-value-rows__row">
      <div class="key-value-rows__key">{{ row.key }}</div>
      <div class="key-value-rows__value">
        <FaIcon :fa-icon="valueFaIcon" class="key-value-rows__icon" />
        <p>{{ row.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.key-value-rows {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 0.9rem 1.1rem;
}

.key-value-rows__row {
  display: contents;
}

.key-value-rows__key {
  padding: 0.85rem 0;
  border-bottom: 1px solid #333344;
  color: #e8341c;
  font: 500 0.85rem/1.4 var(--font-mono);
}

.key-value-rows__value {
  display: flex;
  gap: 0.7rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #333344;
  color: #d0d0e8;
}

.key-value-rows__icon {
  margin-top: 0.3rem;
  color: #555577;
  flex-shrink: 0;
}

.key-value-rows__value p {
  margin: 0;
}

.key-value-rows__row:last-child .key-value-rows__key,
.key-value-rows__row:last-child .key-value-rows__value {
  border-bottom: none;
}

@media (max-width: 767px) {
  .key-value-rows {
    grid-template-columns: 1fr;
  }
}
</style>
