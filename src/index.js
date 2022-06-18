import DForm from './components/DForm.vue'
import DError from './components/DError.vue'
const $dForm = {
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
        maxsize: "File(s) must less than {n}Mb.",
        validnumber: "Input must be a number.",
    },
    message(error) {
        return error.value?.n ? this.validationMessages[error.type].replace(/{n}/g, error.value.n) : this.validationMessages[error.type] || error.type
    },
    customRules: {}
}

export {DForm, DError, $dForm}