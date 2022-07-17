import { createApp } from 'vue'
import App from './App.vue'
import {DForm, DError, $dForm} from './index.js'

const app = createApp(App)

$dForm.customRules = {
    multipleof(val, validateValue) {
        if (Number(val) % validateValue != 0) {
            return {
                type: 'multipleof',
                value: {
                    n: validateValue
                }
            }
        }
        return {}
    }
}
$dForm.validationMessages.multipleof = 'Value must be multiple of {n}'

app.component('DForm', DForm)
app.component('DError', DError)
app.config.globalProperties.$dForm = $dForm

app.mount('#app')