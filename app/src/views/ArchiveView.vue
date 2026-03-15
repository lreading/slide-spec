<script setup lang="ts">
import { contentRepository } from '../content/ContentRepository'

const site = contentRepository.getSiteContent()
const presentations = contentRepository.listPresentations()
</script>

<template>
  <main class="page">
    <div class="page-header">
      <div>
        <p class="page-eyebrow">{{ site.title }}</p>
        <h1 class="page-title">Presentation archive</h1>
      </div>
    </div>

    <section class="archive-grid">
      <article v-for="entry in presentations" :key="entry.id" class="archive-card">
        <p class="archive-quarter">Q{{ entry.quarter }} {{ entry.year }}</p>
        <h2 class="archive-title">{{ entry.title }}</h2>
        <p class="archive-summary">{{ entry.summary }}</p>
        <RouterLink
          :to="{ name: 'presentation', params: { presentationId: entry.id } }"
          class="button button--primary"
        >
          Open presentation
        </RouterLink>
      </article>
    </section>
  </main>
</template>

<style scoped>
.archive-grid {
  display: grid;
  gap: 1rem;
}

.archive-card {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background-color: rgba(18, 24, 36, 0.92);
}

.archive-quarter,
.archive-summary {
  margin: 0;
}

.archive-quarter {
  color: var(--accent-soft);
  font: 600 0.875rem/1.2 var(--font-mono);
}

.archive-title {
  margin: 0;
}

.archive-summary {
  color: var(--secondary-text);
}

@media (min-width: 900px) {
  .archive-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
