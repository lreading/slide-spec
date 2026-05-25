<script setup lang="ts">
import FaIcon from './FaIcon.vue'

const props = withDefaults(
  defineProps<{
    href: string
    faIcon: string
    label: string
    align?: 'start' | 'end' | 'center'
  }>(),
  {
    align: 'end',
  },
)
</script>

<template>
  <a
    class="footer-action-link"
    :class="`footer-action-link--${props.align}`"
    :href="href"
    target="_blank"
    rel="noreferrer"
  >
    <FaIcon :fa-icon="faIcon" />
    <span>{{ label }}</span>
  </a>
</template>

<style scoped>
.footer-action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  background-color: rgba(37, 37, 53, 0.92);
  color: #8888aa;
  font-size: 0.875rem;
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.footer-action-link--start {
  align-self: flex-start;
}

.footer-action-link--end {
  align-self: flex-end;
}

.footer-action-link--center {
  align-self: center;
}

.footer-action-link:hover {
  color: #d0d0e8;
  background-color: rgba(232, 52, 28, 0.08);
}

@media (max-width: 767px) {
  .footer-action-link {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
