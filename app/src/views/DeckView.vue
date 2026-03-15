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
const slides = computed(() => record.value.deck.slides.filter((slide) => slide.enabled))
const navigator = computed(() => new DeckNavigation(slides.value.length))
const slideNumber = computed(() => navigator.value.resolve(route.query.slide))
const currentSlide = computed(() => slides.value[slideNumber.value - 1])
const isPresentationMode = computed(() => route.query.mode === 'presentation')
const isFullscreenAvailable = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)
const onKeydown = (event: KeyboardEvent): void => {
  void handleKeydown(event)
}
const onFullscreenChange = (): void => {
  fullscreenActive.value = Boolean(document.fullscreenElement)
}

const updateRoute = async (nextSlide: number, mode = isPresentationMode.value): Promise<void> => {
  await router.replace({
    query: {
      slide: String(navigator.value.resolve(nextSlide)),
      ...(mode ? { mode: 'presentation' } : {}),
    },
  })
}

const toggleMode = async (): Promise<void> => {
  await updateRoute(slideNumber.value, !isPresentationMode.value)
}

const toggleFullscreen = async (): Promise<void> => {
  if (!isFullscreenAvailable) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await document.documentElement.requestFullscreen()
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
    case 'f':
    case 'F':
      event.preventDefault()
      await toggleFullscreen()
      break
    case 'p':
    case 'P':
      event.preventDefault()
      await toggleMode()
      break
    case 'Escape':
      if (document.fullscreenElement) {
        event.preventDefault()
        await document.exitFullscreen()
      } else if (isPresentationMode.value) {
        event.preventDefault()
        await updateRoute(slideNumber.value, false)
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
  fullscreenActive.value = Boolean(document.fullscreenElement)
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <main class="page" :class="{ 'page--presentation': isPresentationMode }">
    <div v-if="!isPresentationMode" class="page-header">
      <div>
        <p class="page-eyebrow">{{ record.index.subtitle }}</p>
        <h1 class="page-title">{{ record.index.title }}</h1>
      </div>
    </div>

    <PresentationToolbar
      :is-presentation-mode="isPresentationMode"
      :is-fullscreen-available="isFullscreenAvailable"
      :is-fullscreen-active="fullscreenActive"
      :slide-number="slideNumber"
      :slide-total="slides.length"
      @first="updateRoute(navigator.first())"
      @previous="updateRoute(navigator.previous(slideNumber))"
      @next="updateRoute(navigator.next(slideNumber))"
      @last="updateRoute(navigator.last())"
      @toggle-mode="toggleMode"
      @toggle-fullscreen="toggleFullscreen"
    />

    <SlideRenderer
      v-if="currentSlide"
      :record="record"
      :site="site"
      :slide="currentSlide"
      :slide-number="slideNumber"
      :slide-total="slides.length"
    />
  </main>
</template>

<style scoped>
.page--presentation {
  gap: 1rem;
  padding: 1rem;
}
</style>
