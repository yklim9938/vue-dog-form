import { createApp } from 'vue'
import App from './App.vue'
import DogForm from './index.js'

const app = createApp(App)

app.use(DogForm)

const $dogForm = app.config.globalProperties.$dogForm
$dogForm.customRules = {
    spiderman(val) {
        if (val != 'spiderman') {
            return {
                type: 'spiderman'
            }
        }
    }
}

$dogForm.validationMessages.spiderman = 'Input must be "spiderman"'
app.mount('#app')