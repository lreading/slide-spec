<script setup lang="ts">
import mascotUrl from '../../assets/mascot.png'

import type {
  GeneratedPresentationData,
  PresentationDeck,
  SiteContent,
  ThankYouSlide,
} from '../../types/content'

defineProps<{
  deck: PresentationDeck
  generated: GeneratedPresentationData
  site: SiteContent
  slide: ThankYouSlide
}>()
</script>

<template>
  <div class="slide-container">
    <div class="bg-pattern"></div>

    <svg class="decor-circle decor-circle--top-left" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>
    <svg class="decor-circle decor-circle--bottom-right" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>

    <div class="content-wrap">
      <div class="relative group mascot-wrap">
        <img :src="mascotUrl" alt="Cupcake Mascot" class="mascot-glow mascot" />
      </div>

      <div class="text-block">
        <h1 class="hero-title">Thank <span class="accent-text">You!</span></h1>
        <div class="divider-wrap">
          <div class="divider"></div>
        </div>
        <h2 class="hero-subtitle">See you next quarter 🐉</h2>
      </div>

      <div class="actions">
        <a :href="site.links.repository.url" target="_blank" rel="noreferrer" class="pill-btn">
          <i class="fab fa-github pill-icon"></i>
          <div class="pill-copy">
            <span class="pill-eyebrow">Source Code</span>
            <span class="pill-title">GitHub Repo</span>
          </div>
        </a>
        <a :href="site.links.docs.url" target="_blank" rel="noreferrer" class="pill-btn">
          <i class="fas fa-book pill-icon"></i>
          <div class="pill-copy">
            <span class="pill-eyebrow">Documentation</span>
            <span class="pill-title">Read the Docs</span>
          </div>
        </a>
        <a :href="site.links.owasp.url" target="_blank" rel="noreferrer" class="pill-btn">
          <i class="fas fa-shield-alt pill-icon"></i>
          <div class="pill-copy">
            <span class="pill-eyebrow">Foundation</span>
            <span class="pill-title">OWASP Project</span>
          </div>
        </a>
      </div>
    </div>

    <div class="footer-wrap">
      <p class="footer-quote">"making threat modeling less threatening"</p>
    </div>

    <div class="deck-mark">
      <span class="deck-mark__name">Threat Dragon</span>
      <span class="deck-mark__subtitle">{{ deck.subtitle }}</span>
    </div>

    <div class="bottom-strip"></div>
  </div>
</template>

<style scoped>
.slide-container {
  width: 100%;
  min-height: min(80vh, 720px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1e1e2e;
  color: #ffffff;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.decor-circle {
  position: absolute;
  fill: #ffffff;
  pointer-events: none;
}

.decor-circle--top-left {
  top: 0;
  left: 0;
  width: 16rem;
  height: 16rem;
  opacity: 0.13;
  transform: translate(-25%, -25%);
}

.decor-circle--bottom-right {
  bottom: 0;
  right: 0;
  width: 24rem;
  height: 24rem;
  opacity: 0.05;
  transform: translate(33.333333%, 33.333333%);
}

.content-wrap {
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  width: 100%;
  max-width: 64rem;
  padding: 0 2rem;
}

.mascot-wrap {
  margin-bottom: 0.5rem;
}

.mascot {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.mascot-glow {
  filter: drop-shadow(0 0 25px rgba(232, 52, 28, 0.5));
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.text-block {
  text-align: center;
}

.hero-title {
  margin: 0;
  font-size: 4.5rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.accent-text {
  color: #e8341c;
}

.divider-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.divider {
  height: 0.25rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: #e8341c;
  opacity: 0.8;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 300;
  letter-spacing: 0.025em;
  color: #d0d0e8;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pill-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 9999px;
  background-color: rgba(37, 37, 53, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.pill-btn:hover {
  border-color: #e8341c;
  background-color: rgba(232, 52, 28, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.pill-icon {
  font-size: 1.5rem;
  color: #d1d5db;
  transition: color 0.3s ease;
}

.pill-btn:hover .pill-icon {
  color: #e8341c;
}

.pill-copy {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.pill-eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  color: #9ca3af;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pill-title {
  color: #ffffff;
  font-weight: 600;
}

.footer-wrap {
  padding-top: 2rem;
  width: 100%;
  z-index: 10;
  text-align: center;
}

.footer-quote {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-style: italic;
  font-weight: 300;
  font-family: var(--font-mono);
  color: #6b7280;
  opacity: 0.6;
  letter-spacing: 0.05em;
}

.deck-mark {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 10;
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  color: #d0d0e8;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.deck-mark__name {
  color: #9ca3af;
  font-weight: 500;
}

.deck-mark__subtitle {
  color: #e8341c;
  font-weight: 700;
}

.bottom-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.25rem;
  background-color: #e8341c;
}

@media (max-width: 959px) {
  .hero-title {
    font-size: clamp(3rem, 8vw, 4.5rem);
  }

  .hero-subtitle {
    font-size: clamp(1.4rem, 3.8vw, 1.875rem);
    line-height: 1.3;
  }
}

@media (max-width: 767px) {
  .slide-container {
    min-height: 100%;
    padding: 3rem 0 5rem;
  }

  .content-wrap {
    gap: 2rem;
    padding: 0 1.5rem;
  }

  .mascot {
    width: 150px;
    height: 150px;
  }

  .hero-title {
    font-size: clamp(2.5rem, 10vw, 3.5rem);
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .pill-btn {
    justify-content: center;
    width: 100%;
  }

  .footer-wrap {
    position: relative;
    bottom: auto;
    margin-top: 2rem;
  }

  .deck-mark {
    position: relative;
    right: auto;
    bottom: auto;
    margin-top: 1rem;
  }
}
</style>
