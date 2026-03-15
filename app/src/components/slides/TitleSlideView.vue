<script setup lang="ts">
import { computed } from 'vue'

import mascotUrl from '../../assets/mascot.png'

import type { PresentationDeck, SiteContent, TitleSlide } from '../../types/content'

const props = defineProps<{
  deck: PresentationDeck
  site: SiteContent
  slide: TitleSlide
}>()

const footerLinks = computed(() => {
  const toDisplayLabel = (url: string): string => {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')

    return `${parsed.host}${path}`
  }

  return [
    {
      key: 'repository',
      iconClass: 'fab fa-github',
      text: toDisplayLabel(props.site.links.repository.url),
      url: props.site.links.repository.url,
    },
    {
      key: 'docs',
      iconClass: 'fas fa-book',
      text: toDisplayLabel(props.site.links.docs.url),
      url: props.site.links.docs.url,
    },
    {
      key: 'owasp',
      iconClass: 'fas fa-globe',
      text: toDisplayLabel(props.site.links.owasp.url),
      url: props.site.links.owasp.url,
    },
  ]
})
</script>

<template>
  <div class="slide-container">
    <div class="bg-pattern"></div>

    <svg class="decor-circle decor-circle--top-right" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>
    <svg class="decor-circle decor-circle--bottom-left" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="50"></circle>
    </svg>

    <div class="content-wrap">
      <div class="glass-badge">
        <p class="badge-text"><i class="fas fa-shield-alt badge-icon"></i>{{ site.eyebrow }}</p>
      </div>

      <div class="relative group">
        <img :src="mascotUrl" alt="Cupcake Mascot" class="mascot-glow mascot" />
      </div>

      <div class="text-block">
        <h1 class="hero-title">OWASP <span class="accent-text">Threat Dragon</span></h1>
        <div class="divider-wrap">
          <div class="divider"></div>
        </div>
        <h2 class="hero-subtitle">
          Quarterly Community Update —
          <span class="hero-subtitle-strong">{{ deck.subtitle }}</span>
        </h2>
        <p class="hero-quote">"{{ slide.quote }}"</p>
      </div>
    </div>

    <div class="footer-wrap">
      <div class="footer-links">
        <template v-for="(link, index) in footerLinks" :key="link.key">
          <a
            class="footer-link"
            :href="link.url"
            target="_blank"
            rel="noreferrer"
          >
            <i :class="[link.iconClass, 'footer-icon']"></i>
            <p>{{ link.text }}</p>
          </a>
          <div
            v-if="index < footerLinks.length - 1"
            class="footer-separator"
            aria-hidden="true"
          ></div>
        </template>
      </div>
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

.decor-circle--top-right {
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  opacity: 0.13;
  transform: translate(33.333333%, -33.333333%);
}

.decor-circle--bottom-left {
  bottom: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  opacity: 0.07;
  transform: translate(-33.333333%, 33.333333%);
}

.content-wrap {
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 56rem;
  padding: 0 2rem;
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
}

.badge-icon {
  margin-right: 0.5rem;
  color: #e8341c;
}

.mascot-glow {
  filter: drop-shadow(0 0 20px rgba(232, 52, 28, 0.4));
  transition: transform 0.3s ease;
}

.mascot {
  width: 12rem;
  height: 12rem;
  object-fit: contain;
}

.text-block {
  text-align: center;
}

.hero-title {
  margin: 0 0 0.5rem;
  font-size: 3.75rem;
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
  padding: 1rem 0;
}

.divider {
  height: 0.25rem;
  width: 6rem;
  border-radius: 9999px;
  background-color: #e8341c;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 300;
  color: #d0d0e8;
}

.hero-subtitle-strong {
  font-weight: 600;
  color: #ffffff;
}

.hero-quote {
  margin: 0;
  padding-top: 1.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-style: italic;
  font-weight: 300;
  color: #9ca3af;
  opacity: 0.8;
}

.footer-wrap {
  position: absolute;
  bottom: 2rem;
  width: 100%;
  z-index: 10;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #9ca3af;
  font-family: var(--font-mono);
}

.footer-link {
  display: flex;
  align-items: center;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.footer-link:hover {
  color: #d1d5db;
  transform: translateY(-1px);
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
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.25rem;
  background-color: #e8341c;
}

@media (max-width: 959px) {
  .hero-title {
    font-size: clamp(2.75rem, 7vw, 3.75rem);
  }

  .hero-subtitle {
    font-size: clamp(1.4rem, 3.8vw, 1.875rem);
    line-height: 1.3;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-separator {
    display: none;
  }
}

@media (max-width: 767px) {
  .slide-container {
    min-height: 100%;
    padding: 3rem 0 5rem;
  }

  .content-wrap {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  .mascot {
    width: 9rem;
    height: 9rem;
  }

  .hero-title {
    font-size: clamp(2.25rem, 9vw, 3rem);
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-quote {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .footer-wrap {
    position: relative;
    bottom: auto;
    margin-top: 2rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>
