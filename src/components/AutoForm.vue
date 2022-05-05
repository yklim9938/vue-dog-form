<template>
  <form ref="form" @submit.prevent="onAutoSubmit" class="_auto-form" :novalidate="novalidate">
    <slot></slot>
  </form>
</template>

<script>
import validation from '@/assets/validation'
export default {
    inheritAttrs: false,
    name: 'AutoForm',
    props: {
        novalidate: Boolean
    },
    data() {
        return {
            inputs: [],
            autoErrors: []
        }
    },
     provide() {
        return {
            autoErrors: this.autoErrors,
        }
    },
    methods: {
        validateInput(input) {
            let value = input.value
            if (input.type == 'file') value = input.files
            if (!input.required && typeof value == 'string' && value.length < 1) return

            for (let a = 0; a < input.attributes.length; a++) {
                const errorEls = this.getErrorEl(input.parentElement)
                if (errorEls.length > 0) break // already has error, exit loop
                let rule = input.attributes[a].name
                let ruleValue = input.attributes[a].value

                let error = {}
                if (validation[rule]) {
                    error = validation[rule](value, ruleValue)
                }
                else if (this.$autoForm.customRules && typeof this.$autoForm.customRules[rule] == 'function') {
                    error = this.$autoForm.customRules[rule](value, ruleValue)
                }
               
                if (error && error.type) {
                    const errorEl = document.createElement('div')
                    const errorClass = this.$autoForm.errorClass || 'vld-error'
                    errorEl.classList.add(errorClass)
                    errorEl.innerHTML = this.$autoForm.message(error)
                    input.parentElement.insertBefore(errorEl, input.nextSibling)
                }
            }
        },
        inputEvent(e) {
            // remove error element
            const errorEls = this.getErrorEl(e.target.parentElement)
            errorEls.forEach(e => e.remove())
            this.validateInput(e.target)
        },
        getEventType(input) {
            let eventType = 'input'
            if (input.tagName.toLowerCase() == 'select') eventType = 'change'
            return eventType
        },
        getErrorEl(wrapper) {
            const errorClass = this.$autoForm.errorClass || 'vld-error'
            return wrapper.querySelectorAll(`.${errorClass}`)
        },
        onAutoSubmit(e) {
            this.inputs.forEach(i => {
                this.validateInput(i)
            })

            this.autoErrors.forEach(v => {
                v()
            })

            setTimeout(() => {
                let isValid = true
                const errorEls = this.getErrorEl(this.$refs.form)

                if (errorEls.length > 0) isValid = false
                e.isValid = isValid
                this.$emit('submit', e)
            }, 50)
        }
    },
    mounted() {
        const inputClass = this.$autoForm.inputClass || 'vld'
        this.inputs = this.$refs.form.querySelectorAll(`input.${inputClass}, select.${inputClass}, textarea.${inputClass}`)

        this.inputs.forEach((i) => {
            i.addEventListener(this.getEventType(i), this.inputEvent)
        })
    },
    beforeDestroy() {
        this.inputs.forEach(i => {
            i.removeEventListener(this.getEventType(i), this.inputEvent)
            const errorEls = this.getErrorEl(i.parentElement)
            errorEls.forEach(e => {
                e.remove()
            })
        })
    }
};
</script>

<style>
.vld-error {
    color: #d44848;
    font-size: 0.875rem;
}
</style>