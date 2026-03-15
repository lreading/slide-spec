<script setup lang="ts">
import { computed } from 'vue'

import mascotUrl from '../assets/mascot.png'
import { getProjectBadgeDisplay } from '../content/projectBadge'
import { contentRepository } from '../content/ContentRepository'

const site = contentRepository.getSiteContent()
const presentations = contentRepository.listPresentations()

const featuredPresentation = computed(() => presentations.find((entry) => entry.featured) ?? presentations[0])
const badge = computed(() => getProjectBadgeDisplay(site))
</script>

<template>
  <main class="home-page">
    <div class="bg-pattern"></div>

    <svg class="decor-circle decor-circle--top-right" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>
    <svg class="decor-circle decor-circle--bottom-left" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>

    <div class="hero-shell">
      <div v-if="badge" class="glass-badge">
        <p class="badge-text">
          <span class="badge-text__section">
            <i
              v-if="badge.iconClass && badge.iconPosition === 'before'"
              :class="[badge.iconClass, 'badge-icon']"
            ></i>
            <span v-if="badge.label">{{ badge.label }}</span>
            <i
              v-if="badge.iconClass && badge.iconPosition === 'after'"
              :class="[badge.iconClass, 'badge-icon badge-icon--after']"
            ></i>
          </span>
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink
          :to="{ name: 'presentation', params: { presentationId: featuredPresentation.id } }"
          class="hero-cta hero-cta--primary"
        >
          <span class="hero-cta__label">View latest update</span>
          <span class="hero-cta__meta">{{ featuredPresentation.subtitle }}</span>
        </RouterLink>
        <RouterLink :to="{ name: 'archive' }" class="hero-cta hero-cta--secondary">
          <span class="hero-cta__single">Browse archive</span>
        </RouterLink>
      </div>

      <div class="mascot-wrap">
        <img :src="mascotUrl" alt="Cupcake Mascot" class="mascot-glow mascot" />
      </div>

      <div class="hero-copy">
        <h1 class="hero-title">OWASP <span class="accent-text">Threat Dragon</span></h1>
        <div class="divider-wrap">
          <div class="divider"></div>
        </div>
        <h2 class="hero-subtitle">
          Community Updates
        </h2>
        <p class="hero-description">
          roadmap, releases, community and more
        </p>
      </div>
    </div>

    <div class="footer-wrap">
      <div class="footer-links">
        <a :href="site.links.repository.url" target="_blank" rel="noreferrer" class="footer-link">
          <i class="fab fa-github footer-icon"></i>
          <p>github.com/OWASP/threat-dragon</p>
        </a>
        <div class="footer-separator" aria-hidden="true"></div>
        <a :href="site.links.docs.url" target="_blank" rel="noreferrer" class="footer-link">
          <i class="fas fa-book footer-icon"></i>
          <p>threatdragon.com/docs</p>
        </a>
        <div class="footer-separator" aria-hidden="true"></div>
        <a :href="site.links.owasp.url" target="_blank" rel="noreferrer" class="footer-link">
          <i class="fas fa-globe footer-icon"></i>
          <p>owasp.org</p>
        </a>
      </div>
    </div>

    <div class="bottom-strip"></div>
  </main>
</template>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #1e1e2e;
  color: #ffffff;
  padding: 2.5rem var(--page-gutter) 3.5rem;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.decor-circle {
  position: absolute;
  fill: #ffffff;
  pointer-events: none;
}

.decor-circle--top-right {
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  opacity: 0.5;
  transform: translate(33.333333%, -33.333333%);
}

.decor-circle--bottom-left {
  bottom: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  opacity: 0.3;
  transform: translate(-33.333333%, 33.333333%);
}

.hero-shell {
  position: relative;
  z-index: 1;
  width: min(100%, 70rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  text-align: center;
}

.glass-badge {
  margin-bottom: 1rem;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

.badge-text {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  font-family: var(--font-mono);
  color: #d1d5db;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.badge-text__section {
  display: inline-flex;
  align-items: center;
}

.badge-icon {
  margin-right: 0.5rem;
  color: #e8341c;
}

.badge-icon--after {
  margin-right: 0;
  margin-left: 0.5rem;
}

.mascot-wrap {
  position: relative;
}

.mascot {
  width: clamp(9rem, 18vw, 12rem);
  height: clamp(9rem, 18vw, 12rem);
  object-fit: contain;
}

.mascot-glow {
  filter: drop-shadow(0 0 20px rgba(232, 52, 28, 0.4));
}

.hero-copy {
  display: grid;
  gap: 0.75rem;
}

.hero-title {
  margin: 0;
  font-size: clamp(3.5rem, 8vw, 5.8rem);
  line-height: 0.95;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.accent-text {
  color: #e8341c;
}

.divider-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0 0.8rem;
}

.divider {
  width: 6rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: #e8341c;
}

.hero-subtitle {
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2.35rem);
  line-height: 1.2;
  font-weight: 300;
  color: #d0d0e8;
}

.hero-subtitle-strong {
  color: #ffffff;
  font-weight: 600;
}

.hero-description {
  max-width: 44rem;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  margin: 0 auto;
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  line-height: 1.7;
  color: #9ca3af;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1rem;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 13.5rem;
  min-width: 13rem;
  min-height: 3.8rem;
  padding: 0.85rem 1.35rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease,
    transform 120ms ease;
}

.hero-cta:hover {
  transform: translateY(-1px);
}

.hero-cta--primary {
  flex-direction: column;
  gap: 0.08rem;
  color: #fff7f3;
  background: linear-gradient(180deg, #f04d32 0%, #e8341c 100%);
  border-color: rgba(255, 133, 108, 0.65);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 10px 24px rgba(232, 52, 28, 0.28);
}

.hero-cta--primary:hover {
  background: linear-gradient(180deg, #f45d44 0%, #ea3c22 100%);
  border-color: rgba(255, 160, 138, 0.75);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 14px 30px rgba(232, 52, 28, 0.34);
}

.hero-cta--secondary {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%);
  border-color: rgba(255, 255, 255, 0.18);
  color: #f3f5fb;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 6px 18px rgba(0, 0, 0, 0.12);
}

.hero-cta--secondary:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 255, 255, 0.26);
}

.hero-cta__label {
  display: block;
  font-size: 1.05rem;
  line-height: 1.05;
  font-weight: 500;
}

.hero-cta__meta {
  display: block;
  font-size: 0.95rem;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.hero-cta__single {
  display: block;
  font-size: 1.05rem;
  line-height: 1.1;
  font-weight: 500;
}

.footer-wrap {
  position: absolute;
  right: 0;
  bottom: 2rem;
  left: 0;
  z-index: 1;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 0 var(--page-gutter);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: var(--font-mono);
  color: #9ca3af;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  transition: color 120ms ease;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-icon {
  margin-right: 0.5rem;
}

.footer-separator {
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: #4b5563;
}

.bottom-strip {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.25rem;
  background-color: #e8341c;
}

@media (max-width: 767px) {
  .home-page {
    justify-content: flex-start;
    padding-top: 3rem;
  }

  .hero-shell {
    gap: 1.5rem;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }

  .hero-cta {
    width: 100%;
  }

  .footer-wrap {
    position: relative;
    bottom: auto;
    margin-top: 2.5rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .footer-separator {
    display: none;
  }
}
</style>
