<script setup lang="ts">
import { computed } from 'vue'

import { normalizeFontAwesomeIcon } from '../../../../shared/src/fontawesome'

const props = defineProps<{
  faIcon: string
}>()

const iconClass = computed(() => normalizeFontAwesomeIcon(props.faIcon) ?? 'fa-solid fa-star')
</script>

<template>
  <i :class="iconClass" aria-hidden="true"></i>
</template>
