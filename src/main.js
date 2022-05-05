import { createApp } from 'vue'
import App from './App.vue'
import AutoForm from './index.js'

const app = createApp(App)

// Auto Form
const validationMessages = {
    required: "This field is required.",
    minlength: "Input must be at least {n} characters.",
    maxlength: "Input cannot be more than {n} characters.",
    equalto: "Input must match with {label}.",
    validemail: "Please enter a valid email.",
    min: "Minimum value is {n}.",
    max: "Maximum value is {n}.",
    accept: "File(s) extension is not accepted.",
    maxfile: "Please select not more than {n} files.",
    maxsize: "File(s) must less than {n}Mb.",
    validnumber: "Input must be a number.",
    spiderman: "Value must equal to 'spiderman'"
}

app.use(AutoForm)

app.config.globalProperties.$autoForm = {
    message(error) {
        return error.value ? validationMessages[error.type].replace(/{n}/g, error.value.n) : validationMessages[error.type]
    },
    customRules: {
        spiderman(val) {
            if (val != 'spiderman') {
                return {
                    type: 'spiderman'
                }
            }
        }
    },
    inputClass: '',
    errorClass: ''
}


app.mount('#app')