<script setup lang="ts">
import { computed } from 'vue'

import type { PresentationRecord, PresentationSlide, SiteContent } from '../../types/content'
import { getSlideTemplateDefinition } from '../../templates/registry'
import { resolveSlideTemplateId } from '../../templates/resolveSlideTemplate'

const props = defineProps<{
  record: PresentationRecord
  site: SiteContent
  slide: PresentationSlide
  slideNumber: number
  slideTotal: number
}>()

const templateDefinition = computed(() =>
  getSlideTemplateDefinition(resolveSlideTemplateId(props.slide)),
)

const templateProps = computed(() =>
  templateDefinition.value.createProps({
    record: props.record,
    site: props.site,
    slide: props.slide,
    slideNumber: props.slideNumber,
    slideTotal: props.slideTotal,
  }),
)
</script>

<template>
  <component :is="templateDefinition.component" v-bind="templateProps" />
</template>
