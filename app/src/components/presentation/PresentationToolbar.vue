<script setup lang="ts">
import ActionButton from '../ui/ActionButton.vue'

defineProps<{
  slideNumber: number
  slideTotal: number
  navigationLabel?: string
  previousSlideLabel?: string
  nextSlideLabel?: string
  presentationModeLabel?: string
}>()

defineEmits<{
  previous: []
  next: []
  toggleMode: []
}>()
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-group toolbar-group--nav" :aria-label="navigationLabel">
      <button
        v-if="previousSlideLabel"
        type="button"
        class="toolbar-icon-button"
        :aria-label="previousSlideLabel"
        :title="previousSlideLabel"
        @click="$emit('previous')"
      >
        <span aria-hidden="true">&lt;</span>
      </button>

      <span class="toolbar-counter">{{ slideNumber }} / {{ slideTotal }}</span>

      <button
        v-if="nextSlideLabel"
        type="button"
        class="toolbar-icon-button"
        :aria-label="nextSlideLabel"
        :title="nextSlideLabel"
        @click="$emit('next')"
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </div>

    <div class="toolbar-group toolbar-group--meta">
      <ActionButton
        v-if="presentationModeLabel"
        type="button"
        class="toolbar-mode-button"
        @click="$emit('toggleMode')"
      >
        {{ presentationModeLabel }}
      </ActionButton>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  min-height: 2.75rem;
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.toolbar-group--nav {
  gap: 0.5rem;
  padding: 0.2rem 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background-color: rgba(18, 24, 36, 0.52);
}

.toolbar-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  background-color: transparent;
  color: var(--primary-text);
  font: 700 1.1rem/1 var(--font-mono);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.toolbar-icon-button:hover {
  transform: translateY(-1px);
  background-color: rgba(232, 52, 28, 0.14);
  color: var(--accent-color);
}

.toolbar-icon-button:focus-visible,
.toolbar-mode-button:focus-visible {
  outline: 2px solid rgba(232, 52, 28, 0.6);
  outline-offset: 2px;
}

.toolbar-counter {
  color: var(--muted-text);
  font: 500 0.95rem/1 var(--font-mono);
  min-width: 4.5rem;
  text-align: center;
}

.toolbar-mode-button {
  min-height: 2.9rem;
}

@media (max-width: 640px) {
  .toolbar {
    justify-content: center;
    gap: 0.55rem;
  }

  .toolbar-group--meta {
    width: 100%;
    justify-content: center;
  }

  .toolbar-mode-button {
    min-height: 2.6rem;
    padding: 0.7rem 1rem;
  }
}
</style>
