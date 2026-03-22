<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    icon: string | [string, string]
    shape?: 'circle' | 'rounded'
    size?: string
    iconSize?: string
    background?: string
    borderColor?: string
    iconColor?: string
  }>(),
  {
    shape: 'circle',
    size: '60px',
    iconSize: '24px',
    background: 'rgba(232, 52, 28, 0.1)',
    borderColor: 'rgba(232, 52, 28, 0.2)',
    iconColor: '#e8341c',
  },
)

const styleVars = computed(() => ({
  '--icon-badge-size': props.size,
  '--icon-badge-icon-size': props.iconSize,
  '--icon-badge-background': props.background,
  '--icon-badge-border': props.borderColor,
  '--icon-badge-color': props.iconColor,
}))
</script>

<template>
  <div class="icon-badge" :class="`icon-badge--${shape}`" :style="styleVars" v-bind="$attrs">
    <FontAwesomeIcon :icon="icon" class="icon-badge__icon" />
  </div>
</template>

<style scoped>
.icon-badge {
  width: var(--icon-badge-size);
  height: var(--icon-badge-size);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--icon-badge-background);
  border: 1px solid var(--icon-badge-border);
}

.icon-badge--circle {
  border-radius: 999px;
}

.icon-badge--rounded {
  border-radius: 12px;
}

.icon-badge__icon {
  color: var(--icon-badge-color);
  font-size: var(--icon-badge-icon-size);
}
</style>
