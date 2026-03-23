<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { contentRepository } from '../content/ContentRepository'
import { resolvePresentationToolbarContent } from '../content/contentDefaults'
import PresentationShortcutCallout from '../components/presentation/PresentationShortcutCallout.vue'
import { PresentationNavigation } from '../content/PresentationNavigation'
import PresentationToolbar from '../components/presentation/PresentationToolbar.vue'
import SlideRenderer from '../components/presentation/SlideRenderer.vue'

const route = useRoute()
const router = useRouter()
const fullscreenActive = ref(false)
const shortcutHelpDismissed = ref(false)

const site = contentRepository.getSiteContent()
const toolbarContent = resolvePresentationToolbarContent(site)
const shortcutStorageKey = 'slide-spec.shortcut-help.dismissed'
const useUrlOnlyPresentation = import.meta.env.VITE_PRESENTATION_URL_MODE === 'true'
const presentationId = computed(() => String(route.params.presentationId))
const record = computed(() => contentRepository.getPresentation(presentationId.value))
const slides = computed(() => record.value.presentation.slides.filter((slide) => slide.enabled))
const navigator = computed(() => new PresentationNavigation(slides.value.length))
const slideNumber = computed(() => navigator.value.resolve(route.query.slide))
const currentSlide = computed(() => slides.value[slideNumber.value - 1])
const isPresentationMode = computed(() => route.query.mode === 'presentation')
const isFullscreenAvailable = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)
const isPresentationActive = computed(() =>
  useUrlOnlyPresentation ? isPresentationMode.value : (isFullscreenAvailable ? fullscreenActive.value : isPresentationMode.value),
)
const showShortcutHelp = computed(
  () =>
    !isPresentationActive.value
    && !shortcutHelpDismissed.value
    && Boolean(toolbarContent.shortcut_help_title)
    && Boolean(toolbarContent.shortcut_help_body)
    && Boolean(toolbarContent.shortcut_help_dismiss_label),
)
const onKeydown = (event: KeyboardEvent): void => {
  void handleKeydown(event)
}
const syncFullscreenState = (): void => {
  if (useUrlOnlyPresentation) {
    fullscreenActive.value = false
    return
  }

  fullscreenActive.value = Boolean(document.fullscreenElement)

  if (!fullscreenActive.value && isPresentationMode.value && isFullscreenAvailable) {
    void updateRoute(slideNumber.value, false)
  }
}

const syncShortcutPreference = (): void => {
  shortcutHelpDismissed.value = window.localStorage.getItem(shortcutStorageKey) === 'true'
}

const dismissShortcutHelp = (): void => {
  window.localStorage.setItem(shortcutStorageKey, 'true')
  shortcutHelpDismissed.value = true
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
  if (!useUrlOnlyPresentation && isFullscreenAvailable && !document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  }

  await updateRoute(slideNumber.value, true)
}

const exitPresentationMode = async (): Promise<void> => {
  if (!useUrlOnlyPresentation && document.fullscreenElement) {
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
  syncShortcutPreference()
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
  <main class="page presentation-page" :class="{ 'presentation-page--presentation': isPresentationActive }">
    <PresentationShortcutCallout
      v-if="showShortcutHelp"
      :title="toolbarContent.shortcut_help_title!"
      :body="toolbarContent.shortcut_help_body!"
      :dismiss-label="toolbarContent.shortcut_help_dismiss_label!"
      @dismiss="dismissShortcutHelp"
    />

    <PresentationToolbar
      v-if="!isPresentationActive"
      :slide-number="slideNumber"
      :slide-total="slides.length"
      :navigation-label="toolbarContent.navigation_label"
      :previous-slide-label="toolbarContent.previous_slide_label"
      :next-slide-label="toolbarContent.next_slide_label"
      :presentation-mode-label="toolbarContent.presentation_mode_label"
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
.presentation-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100%;
  gap: 1rem;
}

.slide-stage {
  display: flex;
  flex: 1;
  min-height: 0;
}

.slide-stage :deep(.slide-container) {
  width: 100%;
}

.presentation-page--presentation {
  gap: 0;
  padding: 0.35rem;
  overflow: hidden;
}

.presentation-page--presentation .slide-stage {
  overflow: hidden;
}

.slide-stage--presentation :deep(.slide-container) {
  width: 100%;
  height: calc(100dvh - 0.7rem);
  min-height: calc(100dvh - 0.7rem);
  max-height: calc(100dvh - 0.7rem);
}

@media (max-width: 767px) {
  .presentation-page--presentation {
    padding: 0.25rem;
  }

  .slide-stage--presentation :deep(.slide-container) {
    height: calc(100dvh - 0.5rem);
    min-height: calc(100dvh - 0.5rem);
    max-height: calc(100dvh - 0.5rem);
  }
}
</style>
