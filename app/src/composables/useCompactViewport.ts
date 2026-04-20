import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const compactViewportQuery = '(max-width: 767px)'
const compactViewportWidth = 767

const resolveCompactViewport = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(compactViewportQuery).matches
  }

  return window.innerWidth <= compactViewportWidth
}

export function useCompactViewport(): { isCompactViewport: Readonly<Ref<boolean>> } {
  const isCompactViewport = ref(resolveCompactViewport())
  let mediaQuery: MediaQueryList | undefined

  const syncCompactViewport = (): void => {
    isCompactViewport.value = resolveCompactViewport()
  }

  onMounted(() => {
    syncCompactViewport()

    if (typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia(compactViewportQuery)
      mediaQuery.addEventListener('change', syncCompactViewport)
      return
    }

    window.addEventListener('resize', syncCompactViewport)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', syncCompactViewport)
      return
    }

    window.removeEventListener('resize', syncCompactViewport)
  })

  return { isCompactViewport }
}
