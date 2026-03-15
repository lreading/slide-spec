<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    slideNumber: number
    deckSubtitle?: string
    contentPadding?: string
    showDots?: boolean
  }>(),
  {
    contentPadding: '60px 80px',
    showDots: true,
  },
)
</script>

<template>
  <div class="slide-container">
    <div class="layout-grid">
      <div class="sidebar">
        <div class="logo-icon">
          <FontAwesomeIcon icon="dragon" />
        </div>
        <div class="slide-number">{{ String(slideNumber).padStart(2, '0') }}</div>
      </div>

      <div class="main-content" :style="{ padding: contentPadding }">
        <div v-if="showDots" class="bg-dots"></div>
        <div class="header-section z-10">
          <div>
            <h1 class="page-title">{{ title }}</h1>
          </div>
          <div v-if="subtitle">
            <p class="subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div class="content-body z-10">
          <slot />
        </div>

        <div v-if="deckSubtitle" class="deck-mark z-10">
          <span class="deck-mark__name">Threat Dragon</span>
          <span class="deck-mark__subtitle">{{ deckSubtitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-container {
  width: 100%;
  min-height: min(80vh, 720px);
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #1e1e2e;
  overflow: hidden;
  color: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.layout-grid {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  min-height: inherit;
  flex: 1;
}

.sidebar {
  background-color: #252535;
  border-right: 1px solid #333344;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  position: relative;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #e8341c;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: #1e1e2e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e8341c;
  border: 2px solid #e8341c;
  margin-bottom: auto;
}

.slide-number {
  font-family: 'Roboto Mono', monospace;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
}

.content-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 2.25rem;
}

.header-section {
  margin-bottom: 40px;
  border-bottom: 1px solid #333344;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -21px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #e8341c;
}

.subtitle {
  color: #8888aa;
  font-size: 16px;
  margin: 0;
}

.bg-dots {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-image: radial-gradient(#333344 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.deck-mark {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  color: #d0d0e8;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.deck-mark__name {
  color: #9ca3af;
  font-weight: 500;
}

.deck-mark__subtitle {
  color: #e8341c;
  font-weight: 700;
}

@media (max-width: 959px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 24px;
    border-right: 0;
    border-bottom: 1px solid #333344;
  }

  .main-content {
    padding: 32px 24px !important;
  }

  .deck-mark {
    right: 1.5rem;
    bottom: 0.9rem;
  }
}

@media (max-width: 767px) {
  .header-section {
    gap: 12px;
    align-items: flex-start;
    flex-direction: column;
  }

  .deck-mark {
    position: relative;
    right: auto;
    bottom: auto;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
}
</style>
