<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppFooter from './components/AppFooter.vue'
import AppNav from './components/AppNav.vue'
import { contentVersion } from './content/ContentRepository'
import { useCompactViewport } from './composables/useCompactViewport'

const route = useRoute()
const fullscreenActive = ref(false)
const { isCompactViewport } = useCompactViewport()

const syncFullscreenState = (): void => {
  fullscreenActive.value = Boolean(document.fullscreenElement)
}

const showChrome = computed(() => {
  if (route.name !== 'presentation') {
    return true
  }

  if (isCompactViewport.value) {
    return true
  }

  return !(fullscreenActive.value || route.query.mode === 'presentation')
})

onMounted(() => {
  syncFullscreenState()
  document.addEventListener('fullscreenchange', syncFullscreenState)
  window.addEventListener('resize', syncFullscreenState)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
  window.removeEventListener('resize', syncFullscreenState)
})
</script>

<template>
  <div :key="contentVersion" class="app-shell">
    <AppNav v-if="showChrome" />
    <div class="app-shell__view" :class="{ 'app-shell__view--nav-hidden': !showChrome }">
      <RouterView />
    </div>
    <AppFooter v-if="showChrome" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-shell__view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.app-shell__view--nav-hidden {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
</style>
