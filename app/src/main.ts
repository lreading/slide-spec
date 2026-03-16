import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { installDocumentTitleSync } from './content/documentTitle'
import { installFontAwesome } from './plugins/fontawesome'

const app = createApp(App)

installFontAwesome(app)
installDocumentTitleSync(router)

app.use(router).mount('#app')
