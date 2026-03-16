<script setup lang="ts">
import AgendaSlideView from '../slides/AgendaSlideView.vue'
import CommunityHighlightsSlideView from '../slides/CommunityHighlightsSlideView.vue'
import ContributorSpotlightSlideView from '../slides/ContributorSpotlightSlideView.vue'
import HowToContributeSlideView from '../slides/HowToContributeSlideView.vue'
import RecentUpdatesSlideView from '../slides/RecentUpdatesSlideView.vue'
import ReleasesSlideView from '../slides/ReleasesSlideView.vue'
import RoadmapSlideView from '../slides/RoadmapSlideView.vue'
import ThankYouSlideView from '../slides/ThankYouSlideView.vue'
import TitleSlideView from '../slides/TitleSlideView.vue'

import type { PresentationRecord, PresentationSlide, SiteContent } from '../../types/content'

defineProps<{
  record: PresentationRecord
  site: SiteContent
  slide: PresentationSlide
  slideNumber: number
  slideTotal: number
}>()
</script>

<template>
  <TitleSlideView
    v-if="slide.kind === 'title'"
    :deck="record.presentation"
    :site="site"
    :slide="slide"
  />
  <AgendaSlideView
    v-else-if="slide.kind === 'agenda'"
    :deck="record.presentation"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <RecentUpdatesSlideView
    v-else-if="slide.kind === 'recent-updates'"
    :deck="record.presentation"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <ReleasesSlideView
    v-else-if="slide.kind === 'releases'"
    :deck="record.presentation"
    :generated="record.generated"
    :site="site"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <RoadmapSlideView
    v-else-if="slide.kind === 'roadmap'"
    :deck="record.presentation"
    :site="site"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <ContributorSpotlightSlideView
    v-else-if="slide.kind === 'contributor-spotlight'"
    :deck="record.presentation"
    :generated="record.generated"
    :site="site"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <CommunityHighlightsSlideView
    v-else-if="slide.kind === 'community-highlights'"
    :deck="record.presentation"
    :generated="record.generated"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <HowToContributeSlideView
    v-else-if="slide.kind === 'how-to-contribute'"
    :deck="record.presentation"
    :site="site"
    :slide="slide"
    :slide-number="slideNumber"
    :slide-total="slideTotal"
  />
  <ThankYouSlideView
    v-else
    :deck="record.presentation"
    :generated="record.generated"
    :site="site"
    :slide="slide"
  />
</template>
