<script setup lang="ts">
defineProps<{
  title: string
  icon: string | [string, string]
}>()
</script>

<template>
  <div class="section-heading">
    <h2 class="section-heading__title">
      <FontAwesomeIcon :icon="icon" class="section-heading__icon" />
      <span>{{ title }}</span>
    </h2>
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333344;
}

.section-heading__title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.section-heading__icon {
  color: #e8341c;
  flex-shrink: 0;
}
</style>
