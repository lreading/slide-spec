<script setup lang="ts">
import { computed } from 'vue'

import StandardSlideLayout from '../presentation/StandardSlideLayout.vue'
import CalloutBanner from '../ui/CalloutBanner.vue'
import IconBadge from '../ui/IconBadge.vue'
import SurfaceCard from '../ui/SurfaceCard.vue'

import type {
  ContributorSpotlightSlide,
  GeneratedPresentationData,
  PresentationContent,
  SiteContent,
} from '../../types/content'

const props = defineProps<{
  presentation: PresentationContent
  generated: GeneratedPresentationData
  site: SiteContent
  slide: ContributorSpotlightSlide
  slideNumber: number
  slideTotal: number
}>()

const avatarIcons = ['user-astronaut', 'user-ninja', 'user-secret']
const contributors = computed(() =>
  props.slide.content.spotlight.map((entry, index) => {
    const contributor = props.generated.contributors.authors.find((author) => author.login === entry.login)

    return {
      ...entry,
      name: contributor?.name ?? entry.login,
      handle: `@${entry.login}`,
      profileUrl: `https://github.com/${entry.login}`,
      icon: avatarIcons[index] ?? 'fa-user-secret',
    }
  }),
)
const contributorsUrl = computed(() => `${props.site.links.repository.url}/graphs/contributors`)
const bannerContent = computed(() => ({
  prefix: props.slide.content.banner_prefix?.trim(),
  linkLabel: props.slide.content.contributors_link_label?.trim(),
  suffix: props.slide.content.banner_suffix?.trim(),
}))
const showBanner = computed(
  () =>
    Boolean(bannerContent.value.prefix)
    || Boolean(bannerContent.value.linkLabel)
    || Boolean(bannerContent.value.suffix),
)
</script>

<template>
  <StandardSlideLayout
    :title="slide.title"
    :subtitle="slide.subtitle"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
    :presentation-subtitle="presentation.subtitle"
  >
    <div class="profiles-grid">
      <SurfaceCard
        v-for="profile in contributors"
        :key="profile.login"
        class="profile-card"
        :interactive="true"
        hover-shift="y"
        accent="top"
        accent-visibility="hover"
        accent-size="4px"
        radius="lg"
        padding="30px 24px"
      >
        <IconBadge
          :icon="profile.icon"
          class="avatar-container"
          size="100px"
          icon-size="40px"
          background="#1e1e2e"
          border-color="#333344"
          icon-color="#555577"
        />
        <h2 class="contributor-name">{{ profile.name }}</h2>
        <a
          class="github-handle"
          :href="profile.profileUrl"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon :icon="['fab', 'github']" />
          <span>{{ profile.handle }}</span>
        </a>
        <FontAwesomeIcon icon="quote-left" class="quote-icon" />
        <p class="contribution-desc">{{ profile.summary }}</p>
      </SurfaceCard>
    </div>

    <CalloutBanner v-if="showBanner" class="thank-you-banner" variant="dashed" align="center">
      <p class="thank-you-text">
        <FontAwesomeIcon icon="heart" class="text-[#e8341c] mr-2" />
        <template v-if="bannerContent.prefix">{{ bannerContent.prefix }} </template>
        <a
          v-if="bannerContent.linkLabel"
          class="contributors-link"
          :href="contributorsUrl"
          target="_blank"
          rel="noreferrer"
        >
          <strong>{{ generated.contributors.total }} {{ bannerContent.linkLabel }}</strong>
        </a>
        <template v-if="bannerContent.suffix"> {{ bannerContent.suffix }}</template>
      </p>
    </CalloutBanner>
  </StandardSlideLayout>
</template>

<style scoped>
.profiles-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  flex: 1;
}

.profile-card {
  flex: 0 1 calc((100% - 60px) / 3);
  max-width: calc((100% - 60px) / 3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.avatar-container {
  margin-bottom: 20px;
}

:deep(.profile-card:hover .icon-badge) {
  border-color: #e8341c;
}

:deep(.profile-card:hover .icon-badge__icon) {
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
  gap: 0.5rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.github-handle:hover {
  color: #ff8d78;
}

.contribution-desc {
  color: #d0d0e8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px;
  flex: 1;
}

.quote-icon {
  color: rgba(255, 255, 255, 0.1);
  font-size: 24px;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}

.profile-card:hover .quote-icon {
  color: rgba(232, 52, 28, 0.35);
}

.thank-you-text {
  color: #d0d0e8;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.thank-you-banner {
  margin-top: 40px;
}

.thank-you-text strong {
  color: #e8341c;
  font-weight: 600;
}

.contributors-link {
  color: inherit;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.contributors-link:hover {
  color: #ff8d78;
}

@media (max-width: 959px) {
  .profile-card {
    flex-basis: min(100%, 36rem);
    max-width: min(100%, 36rem);
  }
}
</style>
