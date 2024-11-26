import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import dogForm from '../index'

const app = createApp(App)


app.use(dogForm)

app.mount('#app')
