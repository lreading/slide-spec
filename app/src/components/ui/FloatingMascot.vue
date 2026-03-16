<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    size?: string
    glowOpacity?: number
  }>(),
  {
    size: '12rem',
    glowOpacity: 0.4,
  },
)

const mascotStyle = computed(() => ({
  '--floating-mascot-size': props.size,
  '--floating-mascot-glow-opacity': String(props.glowOpacity),
}))
</script>

<template>
  <div class="floating-mascot" :style="mascotStyle">
    <img :src="src" :alt="alt" class="floating-mascot__image" />
  </div>
</template>

<style scoped>
.floating-mascot__image {
  width: var(--floating-mascot-size);
  height: var(--floating-mascot-size);
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(232, 52, 28, var(--floating-mascot-glow-opacity)));
  animation: floating-mascot__float 6s ease-in-out infinite;
}

@keyframes floating-mascot__float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
