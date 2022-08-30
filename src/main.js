import { createApp } from 'vue'
import App from './App.vue'
import dogForm from './index.js'

const app = createApp(App)

app.use(dogForm, {
    customRules: {
        multipleof: {
            rule(val, validateValue) {
                if (Number(val) % validateValue != 0) {
                    return {
                        type: 'multipleof',
                        value: {
                            n: validateValue
                        }
                    }
                }
                return {}
            },
            message: 'Value must be multiple of {n}'
        }
    }
})

app.mount('#app')