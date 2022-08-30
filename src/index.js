import DForm from './components/DForm.vue'
import DError from './components/DError.vue'

const dogForm = {
    install(app, options) {
        app.component('DForm', DForm)
        app.component('DError', DError)

        let $dForm = {
            validationMessages: {
                required: "This field is required.",
                minlength: "Input must be at least {n} characters.",
                maxlength: "Input cannot be more than {n} characters.",
                equalto: "Input value does not match.",
                validemail: "Please enter a valid email.",
                min: "Minimum value is {n}.",
                max: "Maximum value is {n}.",
                accept: "File(s) extension is not accepted.",
                maxfile: "Please select not more than {n} files.",
                maxsize: "File(s) must less than {n}Mb."
            },
            message(error) {
                return error.value?.n ? this.validationMessages[error.type].replace(/{n}/g, error.value.n) : this.validationMessages[error.type] || error.type
            },
            customRules: {}
        }

        if (typeof options == 'object') {
            if (typeof options.defaultMessages == 'object') {
                for (let m in options.defaultMessages) {
                    if (typeof options.defaultMessages[m] == 'string') {
                        $dForm.validationMessages[m] = options.defaultMessages[m]
                    }
                }
            }

            if (typeof options.message == 'function') {
                $dForm.message = options.message
            }

            if (typeof options.customRules == 'object') {
                for (let r in options.customRules) {
                    if (typeof options.customRules[r].rule == 'function') {
                        $dForm.customRules[r] = options.customRules[r].rule
                    }
                    if (typeof options.customRules[r].message == 'string') {
                        $dForm.validationMessages[r] = options.customRules[r].message
                    }
                }
            }
        }
        app.provide('$dForm', $dForm)
    }
}
export default dogForm