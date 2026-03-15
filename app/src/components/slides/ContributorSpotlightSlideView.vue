<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'

import type {
  ContributorSpotlightSlide,
  GeneratedPresentationData,
  PresentationDeck,
} from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  generated: GeneratedPresentationData
  slide: ContributorSpotlightSlide
  slideNumber: number
}>()

const avatarIcons = ['user-astronaut', 'user-ninja', 'user-secret']
const contributors = computed(() =>
  props.slide.spotlight.map((entry, index) => {
    const contributor = props.generated.contributors.authors.find((author) => author.login === entry.login)

    return {
      ...entry,
      name: contributor?.name ?? entry.login,
      handle: `@${entry.login}`,
      icon: avatarIcons[index] ?? 'fa-user-secret',
    }
  }),
)
</script>

<template>
  <StandardSlideLayout
    title="Contributor Spotlight"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :deck-subtitle="deck.subtitle"
  >
    <div class="profiles-grid">
      <div v-for="profile in contributors" :key="profile.login" class="profile-card">
        <div class="avatar-container">
          <FontAwesomeIcon :icon="profile.icon" class="avatar-icon" />
        </div>
        <h2 class="contributor-name">{{ profile.name }}</h2>
        <p class="github-handle"><FontAwesomeIcon :icon="['fab', 'github']" /> {{ profile.handle }}</p>
        <div class="focus-chip">{{ profile.focus_area }}</div>
        <FontAwesomeIcon icon="quote-left" class="quote-icon" />
        <p class="contribution-desc">{{ profile.summary }}</p>
      </div>
    </div>

    <div class="thank-you-banner">
      <p class="thank-you-text">
        <FontAwesomeIcon icon="heart" class="text-[#e8341c] mr-2" /> Special thanks to
        <strong>all {{ generated.contributors.total }} contributors</strong> who submitted PRs,
        reported bugs, and improved docs this quarter!
      </p>
    </div>
  </StandardSlideLayout>
</template>

<style scoped>
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  flex: 1;
}

.profile-card {
  background-color: #252535;
  border-radius: 12px;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-top: 4px solid #333344;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.profile-card:hover {
  transform: translateY(-5px);
  border-top-color: #e8341c;
  background-color: #2a2a3e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #1e1e2e;
  border: 3px solid #333344;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}

.profile-card:hover .avatar-container {
  border-color: #e8341c;
}

.avatar-icon {
  font-size: 40px;
  color: #555577;
}

.profile-card:hover .avatar-icon {
  color: #e8341c;
}

.contributor-name {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px;
}

.github-handle {
  font-family: 'Roboto Mono', monospace;
  color: #e8341c;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.github-handle i {
  margin-right: 6px;
}

.focus-chip {
  background-color: rgba(232, 52, 28, 0.1);
  color: #e8341c;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 20px;
  border: 1px solid rgba(232, 52, 28, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contribution-desc {
  color: #d0d0e8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px;
  flex: 1;
}

.quote-icon {
  color: #333344;
  font-size: 24px;
  margin-bottom: 10px;
}

.profile-card:hover .quote-icon {
  color: rgba(232, 52, 28, 0.2);
}

.thank-you-banner {
  margin-top: 40px;
  background-color: rgba(232, 52, 28, 0.05);
  border: 1px dashed rgba(232, 52, 28, 0.3);
  border-radius: 8px;
  padding: 15px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thank-you-text {
  color: #d0d0e8;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.thank-you-text strong {
  color: #e8341c;
  font-weight: 600;
}

@media (max-width: 959px) {
  .profiles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
