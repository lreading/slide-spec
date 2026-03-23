<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const open = ref(false)
const src = ref('')
const alt = ref('')
const overlayRef = ref<HTMLElement | null>(null)

function close(): void {
  open.value = false
  src.value = ''
  alt.value = ''
  document.body.style.overflow = ''
}

function isDecorativeImage(img: HTMLImageElement): boolean {
  return (
    img.closest('nav, .VPNav, .VPSidebar, .VPLocalNav, button') !== null
    || img.getAttribute('role') === 'presentation'
    || img.getAttribute('aria-hidden') === 'true'
  )
}

function onContentPointerDown(ev: PointerEvent): void {
  const t = ev.target
  if (!(t instanceof HTMLImageElement)) {
    return
  }
  if (isDecorativeImage(t)) {
    return
  }
  const host = t.closest('#VPContent')
  if (!host) {
    return
  }
  ev.preventDefault()
  ev.stopPropagation()
  src.value = t.currentSrc || t.src
  alt.value = t.alt || 'Enlarged image'
  open.value = true
  document.body.style.overflow = 'hidden'
}

function onKeydown(ev: KeyboardEvent): void {
  if (ev.key === 'Escape' && open.value) {
    ev.preventDefault()
    close()
  }
}

let detach: (() => void) | undefined

onMounted(() => {
  const root = document.getElementById('VPContent')
  root?.addEventListener('pointerdown', onContentPointerDown, true)
  document.addEventListener('keydown', onKeydown, true)
  detach = () => {
    root?.removeEventListener('pointerdown', onContentPointerDown, true)
    document.removeEventListener('keydown', onKeydown, true)
  }
})

onUnmounted(() => {
  detach?.()
  document.body.style.overflow = ''
})

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    overlayRef.value?.focus()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="overlayRef"
      class="docs-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      :aria-label="alt"
      @click.self="close"
    >
      <button type="button" class="docs-lightbox-close" aria-label="Close image" @click="close">
        <span class="docs-lightbox-close-icon" aria-hidden="true" />
      </button>
      <img class="docs-lightbox-img" :src="src" :alt="alt" @click.stop />
    </div>
  </Teleport>
</template>

<style scoped>
.docs-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2.5rem);
  background: rgba(15, 18, 28, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  outline: none;
}

.docs-lightbox-img {
  max-width: min(96vw, calc(100% - 2rem));
  max-height: min(88vh, calc(100% - 2rem));
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  cursor: default;
}

.docs-lightbox-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10051;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(20, 22, 32, 0.85);
  color: #f4f4f8;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;
}

.docs-lightbox-close:hover {
  background: rgba(40, 44, 58, 0.95);
  border-color: rgba(255, 255, 255, 0.35);
}

.docs-lightbox-close:focus-visible {
  outline: 2px solid var(--vp-c-brand-1, #b8321a);
  outline-offset: 2px;
}

.docs-lightbox-close-icon {
  position: relative;
  display: block;
  width: 1.15rem;
  height: 1.15rem;
}

.docs-lightbox-close-icon::before,
.docs-lightbox-close-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.docs-lightbox-close-icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.docs-lightbox-close-icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
