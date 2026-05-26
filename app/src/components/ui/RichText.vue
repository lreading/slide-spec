<script setup lang="ts">
import { computed } from 'vue'

import { parseRichTextBlocks } from '../../../../shared/src/rich-text'

const props = defineProps<{
  text: string
}>()

const blocks = computed(() => parseRichTextBlocks(props.text))
</script>

<template>
  <div class="rich-text">
    <template v-for="(block, blockIndex) in blocks" :key="`${block.type}-${blockIndex}`">
      <p v-if="block.type === 'paragraph'" class="rich-text__paragraph">{{ block.text }}</p>
      <ul v-else-if="block.type === 'unordered-list'" class="rich-text__list rich-text__list--unordered">
        <li v-for="(item, itemIndex) in block.items" :key="`${blockIndex}-${itemIndex}`" class="rich-text__item">
          {{ item }}
        </li>
      </ul>
      <ol v-else-if="block.type === 'ordered-list'" class="rich-text__list rich-text__list--ordered">
        <li v-for="(item, itemIndex) in block.items" :key="`${blockIndex}-${itemIndex}`" class="rich-text__item">
          {{ item }}
        </li>
      </ol>
      <div
        v-else
        class="rich-text__spacer"
        :style="{ '--rich-text-spacer-lines': String(block.size) }"
        aria-hidden="true"
      />
    </template>
  </div>
</template>

<style scoped>
.rich-text {
  display: grid;
  align-content: flex-start;
  justify-items: stretch;
  width: 100%;
  row-gap: var(--rich-text-block-gap, var(--rich-text-gap, 0.85em));
  text-align: var(--rich-text-align, left);
}

.rich-text__paragraph,
.rich-text__list {
  margin: 0;
}

.rich-text__list {
  padding-left: var(--rich-text-list-padding-left, 1.25em);
  text-align: left;
}

.rich-text__list--unordered {
  list-style-type: disc;
}

.rich-text__list--ordered {
  list-style-type: decimal;
}

.rich-text__item {
  padding-left: var(--rich-text-marker-gap, 0.2em);
}

.rich-text__item + .rich-text__item {
  margin-top: var(--rich-text-item-gap, 0.25em);
}

.rich-text__item::marker {
  color: var(--rich-text-marker-color, #e8341c);
  font-weight: 700;
}

.rich-text__spacer {
  height: calc(var(--rich-text-spacer-lines, 1) * var(--rich-text-spacer-line-height, 0.85em));
}
</style>
