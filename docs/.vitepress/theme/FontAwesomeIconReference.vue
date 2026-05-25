<script setup lang="ts">
import { computed, ref } from 'vue'

import { fontAwesomeIconDefinitions } from '../../../shared/src/fontawesome'

const query = ref('')

const filteredIcons = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!normalizedQuery) return fontAwesomeIconDefinitions

  return fontAwesomeIconDefinitions.filter((icon) => {
    const searchableText = `${icon.canonical} ${icon.label}`.toLowerCase()

    return searchableText.includes(normalizedQuery)
  })
})

function iconClass(icon: (typeof fontAwesomeIconDefinitions)[number]): string {
  const styleClass = icon.style === 'brands' ? 'fa-brands' : 'fa-solid'

  return `${styleClass} ${icon.canonical}`
}
</script>

<template>
  <section class="fontawesome-reference" aria-labelledby="fontawesome-reference-title">
    <div class="fontawesome-reference__search">
      <label id="fontawesome-reference-title" for="fontawesome-icon-search">Search supported icons</label>
      <input
        id="fontawesome-icon-search"
        v-model="query"
        type="search"
        placeholder="Search by name or YAML value, e.g. github or fa-code"
      />
    </div>

    <p class="fontawesome-reference__count">
      Showing {{ filteredIcons.length }} of {{ fontAwesomeIconDefinitions.length }} supported icons.
    </p>

    <div v-if="filteredIcons.length > 0" class="fontawesome-reference__grid">
      <article
        v-for="icon in filteredIcons"
        :key="icon.canonical"
        class="fontawesome-reference__card"
        :aria-label="`${icon.label}: ${icon.canonical}`"
      >
        <span class="fontawesome-reference__preview" aria-hidden="true">
          <i :class="iconClass(icon)"></i>
        </span>
        <span class="fontawesome-reference__label">{{ icon.label }}</span>
        <code>{{ icon.canonical }}</code>
      </article>
    </div>

    <p v-else class="fontawesome-reference__empty">No supported icons match this search.</p>
  </section>
</template>

<style scoped>
.fontawesome-reference {
  margin: 1.25rem 0 2rem;
}

.fontawesome-reference__search {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.fontawesome-reference__search label {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.fontawesome-reference__search input {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.fontawesome-reference__search input:focus {
  border-color: var(--vp-c-brand-1);
  outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, transparent);
}

.fontawesome-reference__count,
.fontawesome-reference__empty {
  color: var(--vp-c-text-2);
}

.fontawesome-reference__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.fontawesome-reference__card {
  display: grid;
  gap: 0.45rem;
  align-content: start;
  min-height: 8.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 0.85rem;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
}

.fontawesome-reference__preview {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  font-size: 1.25rem;
}

.fontawesome-reference__label {
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.fontawesome-reference__card code {
  width: fit-content;
  white-space: normal;
}
</style>
