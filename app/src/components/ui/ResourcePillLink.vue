<script setup lang="ts">
defineProps<{
  href: string
  icon: string | [string, string]
  title: string
  eyebrow?: string
}>()
</script>

<template>
  <a class="resource-pill-link" :href="href" target="_blank" rel="noreferrer">
    <FontAwesomeIcon :icon="icon" class="resource-pill-link__icon" />
    <div class="resource-pill-link__copy">
      <span v-if="eyebrow" class="resource-pill-link__eyebrow">{{ eyebrow }}</span>
      <span class="resource-pill-link__title">{{ title }}</span>
    </div>
  </a>
</template>

<style scoped>
.resource-pill-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 9999px;
  background-color: rgba(37, 37, 53, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  text-decoration: none;
}

.resource-pill-link:hover {
  border-color: #e8341c;
  background-color: rgba(232, 52, 28, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.resource-pill-link__icon {
  font-size: 1.5rem;
  color: #d1d5db;
  transition: color 0.3s ease;
}

.resource-pill-link:hover .resource-pill-link__icon {
  color: #e8341c;
}

.resource-pill-link__copy {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.resource-pill-link__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  color: #9ca3af;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.resource-pill-link__title {
  color: #ffffff;
  font-weight: 600;
}
</style>
