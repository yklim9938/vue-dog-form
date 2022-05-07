import DogForm from './components/DogForm.vue'
import DogError from './components/DogError.vue'

export default {
    install(app, options) {
        app.component('DogForm', DogForm)
        app.component('DogError', DogError)
    }
}