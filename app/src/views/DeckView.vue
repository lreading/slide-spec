<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { contentRepository } from '../content/ContentRepository'
import { DeckNavigation } from '../content/DeckNavigation'
import PresentationToolbar from '../components/presentation/PresentationToolbar.vue'
import SlideRenderer from '../components/presentation/SlideRenderer.vue'

const route = useRoute()
const router = useRouter()
const fullscreenActive = ref(false)

const site = contentRepository.getSiteContent()
const presentationId = computed(() => String(route.params.presentationId))
const record = computed(() => contentRepository.getPresentation(presentationId.value))
const slides = computed(() => record.value.presentation.slides.filter((slide) => slide.enabled))
const navigator = computed(() => new DeckNavigation(slides.value.length))
const slideNumber = computed(() => navigator.value.resolve(route.query.slide))
const currentSlide = computed(() => slides.value[slideNumber.value - 1])
const isPresentationMode = computed(() => route.query.mode === 'presentation')
const isFullscreenAvailable = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)
const isPresentationActive = computed(() =>
  isFullscreenAvailable ? fullscreenActive.value : isPresentationMode.value,
)
const onKeydown = (event: KeyboardEvent): void => {
  void handleKeydown(event)
}
const syncFullscreenState = (): void => {
  fullscreenActive.value = Boolean(document.fullscreenElement)

  if (!fullscreenActive.value && isPresentationMode.value && isFullscreenAvailable) {
    void updateRoute(slideNumber.value, false)
  }
}

const updateRoute = async (nextSlide: number, mode = isPresentationMode.value): Promise<void> => {
  await router.replace({
    query: {
      slide: String(navigator.value.resolve(nextSlide)),
      ...(mode ? { mode: 'presentation' } : {}),
    },
  })
}

const enterPresentationMode = async (): Promise<void> => {
  if (isFullscreenAvailable && !document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  }

  await updateRoute(slideNumber.value, true)
}

const exitPresentationMode = async (): Promise<void> => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await updateRoute(slideNumber.value, false)
}

const toggleMode = async (): Promise<void> => {
  if (isPresentationMode.value || document.fullscreenElement) {
    await exitPresentationMode()
    return
  }

  await enterPresentationMode()
}

const handleKeydown = async (event: KeyboardEvent): Promise<void> => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return
  }

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case 'PageDown':
    case ' ':
    case 'Enter':
      event.preventDefault()
      await updateRoute(navigator.value.next(slideNumber.value))
      break
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
    case 'Backspace':
      event.preventDefault()
      await updateRoute(navigator.value.previous(slideNumber.value))
      break
    case 'Home':
      event.preventDefault()
      await updateRoute(navigator.value.first())
      break
    case 'End':
      event.preventDefault()
      await updateRoute(navigator.value.last())
      break
    case 'p':
    case 'P':
    case 'f':
    case 'F':
      event.preventDefault()
      await toggleMode()
      break
    case 'Escape':
      if (document.fullscreenElement || isPresentationMode.value) {
        event.preventDefault()
        await exitPresentationMode()
      }
      break
  }
}

watch(
  () => route.query.slide,
  async (value) => {
    const resolved = navigator.value.resolve(value)

    if (String(value ?? '') !== String(resolved)) {
      await updateRoute(resolved)
    }
  },
  { immediate: true },
)

onMounted(() => {
  syncFullscreenState()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', syncFullscreenState)
  document.addEventListener('fullscreenchange', syncFullscreenState)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', syncFullscreenState)
  document.removeEventListener('fullscreenchange', syncFullscreenState)
})
</script>

<template>
  <main class="page deck-page" :class="{ 'deck-page--presentation': isPresentationActive }">
    <PresentationToolbar
      v-if="!isPresentationActive"
      :slide-number="slideNumber"
      :slide-total="slides.length"
      :navigation-label="site.presentation_toolbar?.navigation_label"
      :previous-slide-label="site.presentation_toolbar?.previous_slide_label"
      :next-slide-label="site.presentation_toolbar?.next_slide_label"
      :presentation-mode-label="site.presentation_toolbar?.presentation_mode_label"
      @previous="updateRoute(navigator.previous(slideNumber))"
      @next="updateRoute(navigator.next(slideNumber))"
      @toggle-mode="toggleMode"
    />

    <div class="slide-stage" :class="{ 'slide-stage--presentation': isPresentationActive }">
      <SlideRenderer
        v-if="currentSlide"
        :record="record"
        :site="site"
        :slide="currentSlide"
        :slide-number="slideNumber"
        :slide-total="slides.length"
      />
    </div>
  </main>
</template>

<style scoped>
.deck-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100%;
}

.slide-stage {
  display: flex;
  flex: 1;
  min-height: 0;
}

.slide-stage :deep(.slide-container) {
  width: 100%;
}

.deck-page--presentation {
  gap: 0;
  padding: 0.35rem;
  overflow: hidden;
}

.deck-page--presentation .slide-stage {
  overflow: hidden;
}

.slide-stage--presentation :deep(.slide-container) {
  width: 100%;
  height: calc(100dvh - 0.7rem);
  min-height: calc(100dvh - 0.7rem);
  max-height: calc(100dvh - 0.7rem);
}

@media (max-width: 767px) {
  .deck-page--presentation {
    padding: 0.25rem;
  }

  .slide-stage--presentation :deep(.slide-container) {
    height: calc(100dvh - 0.5rem);
    min-height: calc(100dvh - 0.5rem);
    max-height: calc(100dvh - 0.5rem);
  }
}
</style>
