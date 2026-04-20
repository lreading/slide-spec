import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBook,
  faBug,
  faBullhorn,
  faBullseye,
  faChartLine,
  faCheck,
  faCheckCircle,
  faChevronRight,
  faCode,
  faCodeBranch,
  faExternalLinkAlt,
  faGlobe,
  faHeart,
  faMicrophoneAlt,
  faPodcast,
  faQuoteLeft,
  faRss,
  faShieldAlt,
  faStar,
  faTag,
  faUserAstronaut,
  faUserNinja,
  faUserPlus,
  faUserSecret,
  faUsers,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { App } from 'vue'

config.autoAddCss = false

library.add(
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
  faBook,
  faBug,
  faBullhorn,
  faBullseye,
  faChartLine,
  faCheck,
  faCheckCircle,
  faChevronRight,
  faCode,
  faCodeBranch,
  faExternalLinkAlt,
  faGithub,
  faGlobe,
  faHeart,
  faMicrophoneAlt,
  faPodcast,
  faQuoteLeft,
  faRss,
  faShieldAlt,
  faStar,
  faTag,
  faUserAstronaut,
  faUserNinja,
  faUserPlus,
  faUserSecret,
  faUsers,
  faWrench,
)

export const installFontAwesome = (app: App): void => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
