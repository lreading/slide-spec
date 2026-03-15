import { config } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '../plugins/fontawesome'

config.global.components = {
  ...config.global.components,
  FontAwesomeIcon,
}
