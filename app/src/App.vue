<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppNav from './components/AppNav.vue'

const route = useRoute()
const fullscreenActive = ref(false)

const syncFullscreenState = (): void => {
  fullscreenActive.value = Boolean(document.fullscreenElement)
}

const showNav = computed(
  () => !(route.name === 'presentation' && fullscreenActive.value),
)

onMounted(() => {
  syncFullscreenState()
  document.addEventListener('fullscreenchange', syncFullscreenState)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
})
</script>

<template>
  <div class="app-shell">
    <AppNav v-if="showNav" />
    <div class="app-shell__view" :class="{ 'app-shell__view--nav-hidden': !showNav }">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-shell__view {
  min-height: 100vh;
}

.app-shell__view--nav-hidden {
  min-height: 100vh;
}
</style>
