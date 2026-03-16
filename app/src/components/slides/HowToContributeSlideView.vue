<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import CalloutBanner from '../ui/CalloutBanner.vue'
import FooterActionLink from '../ui/FooterActionLink.vue'
import IconBadge from '../ui/IconBadge.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type { HowToContributeSlide, PresentationDeck, SiteContent } from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  site: SiteContent
  slide: HowToContributeSlide
  slideNumber: number
  slideTotal: number
}>()

const icons = ['bug', 'code-branch', 'book', 'bullhorn']
const trailingIcons = ['arrow-right', 'arrow-right', 'arrow-right', 'star']
const repositoryLink = computed(() => props.site.links.repository)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title ?? 'How to Contribute'"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :deck-subtitle="deck.subtitle"
    content-padding="50px 80px"
    :show-dots="false"
  >
    <div class="contribution-grid">
      <SurfaceCard
        v-for="(card, index) in slide.cards"
        :key="card.title"
        class="contrib-card"
        :interactive="true"
        hover-shift="y"
        accent="left"
        accent-visibility="hover"
        accent-size="4px"
        radius="lg"
        padding="25px"
        min-height="184px"
        max-height="220px"
      >
        <IconBadge :icon="icons[index]" shape="rounded" class="icon-wrapper" icon-size="28px" />
        <div class="card-content">
          <h2 class="card-title">{{ card.title }}</h2>
          <p class="card-text">{{ card.description }}</p>
          <a class="card-link" :href="card.url" target="_blank" rel="noreferrer">
            {{ card.url_label }} <FontAwesomeIcon :icon="trailingIcons[index]" />
          </a>
        </div>
      </SurfaceCard>
    </div>

    <CalloutBanner class="footer-cta">
      <div class="repo-info">
        <FontAwesomeIcon :icon="['fab', 'github']" class="text-xl mr-3" />
        <p>{{ slide.footer_text ?? 'Open Source and Community Driven' }}</p>
      </div>
      <template v-if="repositoryLink" #action>
        <FooterActionLink :href="repositoryLink.url" icon="code" :label="repositoryLink.label" />
      </template>
    </CalloutBanner>
  </StandardSlideLayout>
</template>

<style scoped>
.contribution-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: max-content;
  align-content: start;
  gap: 25px;
  margin-bottom: 25px;
}

.contrib-card {
  display: flex;
  align-items: flex-start;
}

.contrib-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.icon-wrapper {
  margin-right: 20px;
}

.card-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: auto;
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.25rem;
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

@media (max-width: 959px) {
  .contribution-grid {
    grid-template-columns: 1fr;
  }
}
</style>
