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
    <div class="toolbar-group toolbar-group--nav" :aria-label="navigationLabel ?? 'Slide navigation'">
      <button
        type="button"
        class="toolbar-icon-button"
        :aria-label="previousSlideLabel ?? 'Previous slide'"
        :title="previousSlideLabel ?? 'Previous slide'"
        @click="$emit('previous')"
      >
        <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
      </button>

      <span class="toolbar-counter">{{ slideNumber }} / {{ slideTotal }}</span>

      <button
        type="button"
        class="toolbar-icon-button"
        :aria-label="nextSlideLabel ?? 'Next slide'"
        :title="nextSlideLabel ?? 'Next slide'"
        @click="$emit('next')"
      >
        <FontAwesomeIcon :icon="['fas', 'arrow-right']" />
      </button>
    </div>

    <div class="toolbar-group toolbar-group--meta">
      <ActionButton type="button" class="toolbar-mode-button" @click="$emit('toggleMode')">
        {{ presentationModeLabel ?? 'Presentation mode' }}
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
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.toolbar-group--nav {
  gap: 0.5rem;
}

.toolbar-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background-color: rgba(28, 35, 51, 0.34);
  color: var(--primary-text);
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.toolbar-icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(232, 52, 28, 0.56);
  background-color: rgba(232, 52, 28, 0.14);
  color: var(--brand);
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
  }

  .toolbar-group--meta {
    width: 100%;
    justify-content: center;
  }
}
</style>
