import type { App } from "vue"

import type DogFormOptions from "./src/types/DogFormOptions"
import type { ErrorObject } from "./src/types/ErrorObject"
import type { DogFormActivate } from './src/types/DogFormActivate'
import builtInValidations from './src/assets/built-in-validations'
import { dogFormKey } from "./src/types/provides";

import DForm from "./src/components/DForm.vue"
import DError from "./src/components/DError.vue"

export { DForm, DError }
declare module 'vue' {
    export interface GlobalComponents {
        DForm: typeof DForm,
        DError: typeof DError
    }
}

declare global {
    interface DogSubmitEvent extends Event {
        isValid?: boolean
    }
    type DForm = InstanceType<typeof DForm>
    type DError = InstanceType<typeof DError>
}


export default {
    install: (app: App, options?: DogFormOptions) => {
        app.component('DForm', DForm)
        app.component('DError', DError)

        let validationRules = builtInValidations
        if (options?.customRules) {
            validationRules = { ...validationRules, ...options.customRules }
        }

        if (typeof options?.defaultMessages == 'object') {
            Object.keys(options?.defaultMessages).forEach(r => {
                if (validationRules[r] && options.defaultMessages?.[r]) {
                    validationRules[r].message = options.defaultMessages[r]
                }
            })
        }

        const builtInMessageGenerator = (error: ErrorObject) => {
            return (error.value?.n ? validationRules[error.type].message.replace(/{n}/g, error.value.n) : validationRules[error.type].message) || error.type
        }

        let defaultActivate: DogFormActivate = 'always'
        if (typeof options?.activate == 'string' && ['always', 'first_submit', 'only_submit', 'never'].indexOf(options.activate) > -1) {
            defaultActivate = options.activate
        }

        let nativeValidate = false
        if (typeof options?.nativeValidate == 'boolean') {
            nativeValidate = options.nativeValidate
        }

        const $dForm = {
            message: typeof options?.message == 'function' ? options.message : builtInMessageGenerator,
            validationRules,
            activate: defaultActivate,
            nativeValidate: nativeValidate
        }

        app.provide(dogFormKey, $dForm)
    }
}