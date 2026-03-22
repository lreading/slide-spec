<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ActionButton from '../components/ui/ActionButton.vue'
import { PresentationCatalog } from '../content/PresentationCatalog'
import { buildPresentationPagination } from '../content/PresentationPagination'
import { contentRepository } from '../content/ContentRepository'
import { resolvePresentationsPageContent } from '../content/contentDefaults'

const presentations = contentRepository.listPresentations()
const site = contentRepository.getSiteContent()
const catalog = new PresentationCatalog(presentations)

const search = ref('')
const selectedYear = ref<string>('all')
const currentPage = ref(1)
const pageSize = 12
const pageContent = computed(() => resolvePresentationsPageContent(site))

const availableYears = computed(() => catalog.listYears())
const activeYear = computed(() =>
  selectedYear.value === 'all' ? null : Number.parseInt(selectedYear.value, 10),
)
const pageResult = computed(() =>
  catalog.getPage({
    page: currentPage.value,
    pageSize,
    search: search.value,
    year: activeYear.value,
  }),
)
const paginationItems = computed(() =>
  buildPresentationPagination(pageResult.value.totalPages, pageResult.value.page),
)

watch([search, selectedYear], () => {
  currentPage.value = 1
})

watch(pageResult, (result) => {
  if (result.page !== currentPage.value) {
    currentPage.value = result.page
  }
})

function goToPage(page: number): void {
  currentPage.value = page
}
</script>

<template>
  <main class="page">
    <div class="page-header presentations-header">
      <div class="presentations-heading">
        <h1 v-if="pageContent.title" class="presentations-eyebrow">{{ pageContent.title }}</h1>
      </div>
    </div>

    <section class="presentations-panel">
      <div class="presentations-toolbar">
        <label class="presentations-field">
          <span v-if="pageContent.search_label" class="presentations-field__label">{{ pageContent.search_label }}</span>
          <input
            v-model="search"
            class="presentations-input"
            type="search"
            :placeholder="pageContent.search_placeholder"
          />
        </label>

        <label class="presentations-field presentations-field--year">
          <span v-if="pageContent.year_label" class="presentations-field__label">{{ pageContent.year_label }}</span>
          <select v-model="selectedYear" class="presentations-select">
            <option value="all">{{ pageContent.all_years_label }}</option>
            <option v-for="year in availableYears" :key="year" :value="String(year)">
              {{ year }}
            </option>
          </select>
        </label>
      </div>

      <div class="presentations-results-summary">
        <p>
          <strong>{{ pageResult.totalItems }}</strong>
          {{ pageResult.totalItems === 1 ? pageContent.presentation_singular_label : pageContent.presentation_plural_label }}
          <template v-if="pageContent.total_label"> {{ pageContent.total_label }}</template>
        </p>
        <p v-if="pageResult.totalItems > 0">
          <template v-if="pageContent.page_label">{{ pageContent.page_label }} </template>
          {{ pageResult.page }}
          <template v-if="pageContent.page_of_label"> {{ pageContent.page_of_label }} </template>
          {{ pageResult.totalPages }}
          <template v-if="pageContent.showing_label"> · {{ pageContent.showing_label }}</template>
          {{ pageResult.startItem }}-{{ pageResult.endItem }}
        </p>
      </div>

      <div v-if="pageResult.items.length" class="presentations-list">
        <article v-for="entry in pageResult.items" :key="entry.id" class="presentations-row">
          <div class="presentations-meta">
            <p class="presentations-subtitle">{{ entry.subtitle }}</p>
            <p class="presentations-id">{{ entry.id }}</p>
          </div>

          <div class="presentations-copy">
            <RouterLink
              :to="{ name: 'presentation', params: { presentationId: entry.id } }"
              class="presentations-primary-link"
            >
              <h2 class="presentations-title">{{ entry.title }}</h2>
              <p class="presentations-summary">{{ entry.summary }}</p>
            </RouterLink>
          </div>

          <div class="presentations-actions">
            <ActionButton
              :to="{ name: 'presentation', params: { presentationId: entry.id } }"
              class="presentations-link"
            >
              {{ pageContent.open_presentation_label }}
            </ActionButton>
          </div>
        </article>
      </div>

      <div v-else class="presentations-empty">
        <h2>{{ pageContent.empty_title }}</h2>
        <p v-if="pageContent.empty_message">{{ pageContent.empty_message }}</p>
      </div>

      <div v-if="pageResult.totalPages > 1" class="presentations-pagination">
        <button
          class="presentations-page-button"
          :disabled="pageResult.page === 1"
          type="button"
          @click="goToPage(pageResult.page - 1)"
        >
          {{ pageContent.previous_page_label }}
        </button>

        <button
          v-for="item in paginationItems"
          :key="item.key"
          class="presentations-page-button"
          :class="{
            'presentations-page-button--active': item.current,
            'presentations-page-button--ellipsis': item.ellipsis,
          }"
          :disabled="item.ellipsis"
          type="button"
          @click="item.page && goToPage(item.page)"
        >
          {{ item.label }}
        </button>

        <button
          class="presentations-page-button"
          :disabled="pageResult.page === pageResult.totalPages"
          type="button"
          @click="goToPage(pageResult.page + 1)"
        >
          {{ pageContent.next_page_label }}
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.presentations-id,
.presentations-summary,
.presentations-results-summary p {
  margin: 0;
}

.presentations-header {
  gap: 1.5rem;
  align-items: end;
}

.presentations-heading {
  display: grid;
}

.presentations-eyebrow {
  color: var(--accent-soft);
  font: 700 0.95rem/1.2 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.95;
}

.presentations-panel {
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(232, 52, 28, 0.06), rgba(232, 52, 28, 0)),
    rgba(18, 24, 36, 0.92);
}

.presentations-toolbar {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) 180px;
}

.presentations-field {
  display: grid;
  gap: 1.2rem;
}

.presentations-field__label {
  color: var(--secondary-text);
  font: 600 0.8rem/1.2 var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.presentations-input,
.presentations-select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  background-color: rgba(37, 37, 53, 0.95);
  color: var(--primary-text);
  font: inherit;
}

.presentations-input::placeholder {
  color: rgba(208, 208, 232, 0.45);
}

.presentations-input:focus,
.presentations-select:focus {
  outline: 2px solid rgba(232, 52, 28, 0.45);
  outline-offset: 2px;
  border-color: rgba(232, 52, 28, 0.35);
}

.presentations-results-summary {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  justify-content: space-between;
  color: var(--secondary-text);
  font-size: 0.95rem;
}

.presentations-list {
  display: grid;
  gap: 0.9rem;
}

.presentations-row {
  display: grid;
  gap: 1rem;
  align-items: center;
  grid-template-columns: 140px minmax(0, 1fr) auto;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.95rem;
  background-color: rgba(37, 37, 53, 0.78);
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.presentations-primary-link {
  display: grid;
  gap: 0.45rem;
  padding: 0.15rem 0;
  text-decoration: none;
  color: inherit;
  border-radius: 0.5rem;
  transition:
    transform 140ms ease,
    opacity 140ms ease;
}

.presentations-row:has(.presentations-primary-link:hover),
.presentations-row:has(.presentations-primary-link:focus-visible) {
  border-color: rgba(232, 52, 28, 0.24);
  background-color: rgba(46, 34, 36, 0.92);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.presentations-primary-link:hover .presentations-title,
.presentations-primary-link:focus-visible .presentations-title {
  color: var(--accent-bright);
}

.presentations-primary-link:hover,
.presentations-primary-link:focus-visible {
  transform: translateX(0.2rem);
}

.presentations-primary-link:hover .presentations-summary,
.presentations-primary-link:focus-visible .presentations-summary {
  color: var(--primary-text);
}

.presentations-primary-link:focus-visible {
  outline: 2px solid rgba(232, 52, 28, 0.45);
  outline-offset: 0.3rem;
}

.presentations-meta {
  display: grid;
  gap: 0.35rem;
}

.presentations-subtitle {
  color: var(--accent-soft);
  font: 600 0.875rem/1.2 var(--font-mono);
  margin: 0;
}

.presentations-id {
  color: rgba(208, 208, 232, 0.55);
  font: 500 0.78rem/1.2 var(--font-mono);
}

.presentations-title {
  margin: 0;
  font-size: 1.15rem;
}

.presentations-summary {
  color: var(--secondary-text);
}

.presentations-copy {
  display: grid;
  gap: 0.45rem;
}

.presentations-actions {
  display: flex;
  justify-content: flex-end;
}

.presentations-page-button {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background-color: rgba(232, 52, 28, 0.1);
  color: var(--primary-text);
  cursor: pointer;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.presentations-link {
  padding: 0.75rem 1rem;
  font-size: 1.02rem;
  white-space: nowrap;
}

.presentations-page-button {
  padding: 0.55rem 0.9rem;
  font: 600 0.9rem/1 var(--font-mono);
}

.presentations-page-button:hover:not(:disabled),
.presentations-page-button--active {
  border-color: rgba(232, 52, 28, 0.5);
  background-color: rgba(232, 52, 28, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
}

.presentations-page-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.presentations-page-button--ellipsis {
  border-color: transparent;
  background-color: transparent;
  transform: none;
}

.presentations-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.presentations-empty {
  display: grid;
  gap: 0.35rem;
  padding: 2rem 1rem;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 1rem;
  color: var(--secondary-text);
}

.presentations-empty h2 {
  margin: 0;
  color: var(--primary-text);
}

@media (max-width: 900px) {
  .presentations-header {
    align-items: start;
  }

  .presentations-toolbar,
  .presentations-row {
    grid-template-columns: 1fr;
  }

  .presentations-results-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .presentations-actions,
  .presentations-pagination {
    justify-content: flex-start;
  }
}
</style>
