import { createApp } from 'vue'
import App from './App.vue'
import DogForm from './index.js'

const app = createApp(App)

app.use(DogForm)

const $dogForm = app.config.globalProperties.$dogForm
$dogForm.customRules = {
    multipleof(val, validateValue) {
        if (Number(val) % validateValue != 0) {
            return {
                type: 'multipleof',
                value: {
                    n: validateValue
                }
            }
        }
    }
}

$dogForm.validationMessages.multipleof = 'Value must be multiple of {n}'
app.mount('#app')