<script setup lang="ts">
import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type { HowToContributeSlide, PresentationDeck } from '../../types/content'

defineProps<{
  deck: PresentationDeck
  slide: HowToContributeSlide
  slideNumber: number
}>()

const icons = ['bug', 'code-branch', 'book', 'bullhorn']
const trailingIcons = ['arrow-right', 'arrow-right', 'arrow-right', 'star']
</script>

<template>
  <StandardSlideLayout
    title="How to Contribute"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
    content-padding="50px 80px"
    :show-dots="false"
  >
    <div class="contribution-grid">
      <div v-for="(card, index) in slide.cards" :key="card.title" class="contrib-card">
        <div class="icon-wrapper">
          <FontAwesomeIcon :icon="icons[index]" />
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ card.title }}</h2>
          <p class="card-text">{{ card.description }}</p>
          <a class="card-link" :href="card.url" target="_blank" rel="noreferrer">
            {{ card.url_label }} <FontAwesomeIcon :icon="trailingIcons[index]" />
          </a>
        </div>
      </div>
    </div>

    <div class="footer-cta">
      <div class="repo-info">
        <FontAwesomeIcon :icon="['fab', 'github']" class="text-xl mr-3" />
        <p>Open Source and Community Driven</p>
      </div>
      <a class="repo-link" href="https://github.com/OWASP/threat-dragon" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon="code" /> github.com/OWASP/threat-dragon
      </a>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.contribution-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 25px;
  flex: 1;
  margin-bottom: 25px;
}

.contrib-card {
  background-color: #252535;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: flex-start;
  border: 1px solid #333344;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contrib-card:hover {
  border-color: #e8341c;
  background-color: #2a2a3e;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.contrib-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #e8341c;
  opacity: 0;
  transition: opacity 0.3s;
}

.contrib-card:hover::before {
  opacity: 1;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: rgba(232, 52, 28, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.icon-wrapper i {
  font-size: 28px;
  color: #e8341c;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
}

.card-text {
  font-size: 14px;
  color: #d0d0e8;
  line-height: 1.5;
  margin: 0 0 12px;
}

.card-link {
  font-size: 13px;
  font-weight: 500;
  color: #e8341c;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: auto;
}

.card-link i {
  margin-left: 6px;
  transition: transform 0.2s;
}

.card-link:hover i {
  transform: translateX(3px);
}

.footer-cta {
  background-color: #252535;
  border-top: 1px solid #333344;
  padding: 15px 25px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.repo-info {
  display: flex;
  align-items: center;
  color: #d0d0e8;
  font-size: 14px;
}

.repo-link {
  font-family: 'Roboto Mono', monospace;
  color: #ffffff;
  background-color: #333344;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.repo-link:hover {
  background-color: #e8341c;
  color: #ffffff;
}

.repo-link i {
  margin-right: 8px;
}

@media (max-width: 959px) {
  .contribution-grid {
    grid-template-columns: 1fr;
  }

  .footer-cta {
    gap: 16px;
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
