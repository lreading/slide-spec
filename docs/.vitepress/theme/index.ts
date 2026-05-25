import DefaultTheme from 'vitepress/theme'
import '@fortawesome/fontawesome-free/css/all.min.css'

import FontAwesomeIconReference from './FontAwesomeIconReference.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FontAwesomeIconReference', FontAwesomeIconReference)
  },
}
