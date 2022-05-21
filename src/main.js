import { createApp } from 'vue'
import App from './App.vue'
import {DogForm, DogError, $dogForm} from './index.js'

const app = createApp(App)

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

app.component('DogForm', DogForm)
app.component('DogError', DogError)
app.config.globalProperties.$dogForm = $dogForm

app.mount('#app')