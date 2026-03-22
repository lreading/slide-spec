<script setup lang="ts">
defineProps<{
  title: string
  body: string
  dismissLabel: string
}>()

defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <aside class="shortcut-callout" aria-live="polite">
    <div class="shortcut-callout__copy">
      <p class="shortcut-callout__title">{{ title }}</p>
      <p class="shortcut-callout__body">{{ body }}</p>
    </div>
    <button type="button" class="shortcut-callout__dismiss" @click="$emit('dismiss')">
      {{ dismissLabel }}
    </button>
  </aside>
</template>

<style scoped>
.shortcut-callout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(232, 52, 28, 0.18);
  background: rgba(37, 37, 53, 0.9);
}

.shortcut-callout__copy {
  display: grid;
  gap: 0.2rem;
}

.shortcut-callout__title {
  margin: 0;
  color: #ffffff;
  font-weight: 600;
}

.shortcut-callout__body {
  margin: 0;
  color: #c3c8d7;
  font-size: 0.95rem;
  line-height: 1.45;
}

.shortcut-callout__dismiss {
  border: 0;
  background: transparent;
  color: #e8341c;
  font-weight: 600;
  cursor: pointer;
}

.shortcut-callout__dismiss:hover {
  color: #ff6a50;
}
</style>
