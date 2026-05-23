import type { Component } from 'vue'

import AgendaSlideView from '../components/slides/AgendaSlideView.vue'
import CommunityHighlightsSlideView from '../components/slides/CommunityHighlightsSlideView.vue'
import ContributorSpotlightSlideView from '../components/slides/ContributorSpotlightSlideView.vue'
import HowToContributeSlideView from '../components/slides/HowToContributeSlideView.vue'
import ImageAndBulletsSlideView from '../components/slides/ImageAndBulletsSlideView.vue'
import RecentUpdatesSlideView from '../components/slides/RecentUpdatesSlideView.vue'
import ReleasesSlideView from '../components/slides/ReleasesSlideView.vue'
import RoadmapSlideView from '../components/slides/RoadmapSlideView.vue'
import ThankYouSlideView from '../components/slides/ThankYouSlideView.vue'
import TitleSlideView from '../components/slides/TitleSlideView.vue'

import type { PresentationRecord, PresentationSlide, SiteContent } from '../types/content'
import { slideTemplateValidators, type SlideTemplateValidator } from './validation'
import type { SlideTemplateId } from './templateIds'

export interface SlideTemplateRenderContext {
  record: PresentationRecord
  site: SiteContent
  slide: PresentationSlide
  slideNumber: number
  slideTotal: number
}

export interface SlideTemplateDefinition {
  id: SlideTemplateId
  label: string
  component: Component
  validate: SlideTemplateValidator
  createProps: (context: SlideTemplateRenderContext) => Record<string, unknown>
}

const createSharedSlideProps = (context: SlideTemplateRenderContext): Record<string, unknown> => ({
  presentation: context.record.presentation,
  slide: context.slide,
  slideNumber: context.slideNumber,
  slideTotal: context.slideTotal,
})

const slideTemplateRegistry: Record<SlideTemplateId, SlideTemplateDefinition> = {
  hero: {
    id: 'hero',
    label: 'Hero',
    component: TitleSlideView,
    validate: slideTemplateValidators.hero,
    createProps: (context) => ({
      presentation: context.record.presentation,
      site: context.site,
      slide: context.slide,
    }),
  },
  agenda: {
    id: 'agenda',
    label: 'Agenda',
    component: AgendaSlideView,
    validate: slideTemplateValidators.agenda,
    createProps: createSharedSlideProps,
  },
  'section-list-grid': {
    id: 'section-list-grid',
    label: 'Section List Grid',
    component: RecentUpdatesSlideView,
    validate: slideTemplateValidators['section-list-grid'],
    createProps: createSharedSlideProps,
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    component: ReleasesSlideView,
    validate: slideTemplateValidators.timeline,
    createProps: (context) => ({
      ...createSharedSlideProps(context),
      generated: context.record.generated,
      site: context.site,
    }),
  },
  'progress-timeline': {
    id: 'progress-timeline',
    label: 'Progress Timeline',
    component: RoadmapSlideView,
    validate: slideTemplateValidators['progress-timeline'],
    createProps: (context) => ({
      ...createSharedSlideProps(context),
      site: context.site,
    }),
  },
  people: {
    id: 'people',
    label: 'People',
    component: ContributorSpotlightSlideView,
    validate: slideTemplateValidators.people,
    createProps: (context) => ({
      ...createSharedSlideProps(context),
      generated: context.record.generated,
      site: context.site,
    }),
  },
  'metrics-and-links': {
    id: 'metrics-and-links',
    label: 'Metrics and Links',
    component: CommunityHighlightsSlideView,
    validate: slideTemplateValidators['metrics-and-links'],
    createProps: (context) => ({
      ...createSharedSlideProps(context),
      generated: context.record.generated,
    }),
  },
  'image-and-bullets': {
    id: 'image-and-bullets',
    label: 'Image and Bullets',
    component: ImageAndBulletsSlideView,
    validate: slideTemplateValidators['image-and-bullets'],
    createProps: createSharedSlideProps,
  },
  'action-cards': {
    id: 'action-cards',
    label: 'Action Cards',
    component: HowToContributeSlideView,
    validate: slideTemplateValidators['action-cards'],
    createProps: (context) => ({
      ...createSharedSlideProps(context),
      site: context.site,
    }),
  },
  closing: {
    id: 'closing',
    label: 'Closing',
    component: ThankYouSlideView,
    validate: slideTemplateValidators.closing,
    createProps: (context) => ({
      presentation: context.record.presentation,
      generated: context.record.generated,
      site: context.site,
      slide: context.slide,
    }),
  },
}

export const getSlideTemplateDefinition = (
  templateId: SlideTemplateId,
): SlideTemplateDefinition => slideTemplateRegistry[templateId]
