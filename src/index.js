import AutoForm from './components/AutoForm.vue'
import AutoError from './components/AutoError.vue'

export default {
    install(app, options) {
        app.component('AutoForm', AutoForm)
        app.component('AutoError', AutoError)
    }
}