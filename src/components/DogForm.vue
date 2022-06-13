<template>
  <form ref="form" @submit.prevent="dogSubmit" class="_dog-form" :novalidate="novalidate">
    <slot></slot>
  </form>
</template>

<script>
import validation from '@/assets/validation'
export default {
    inheritAttrs: false,
    name: 'DogForm',
    props: {
        novalidate: Boolean
    },
    data() {
        return {
            inputs: [],
            dogErrors: [],
            errorClass: this.$dogForm.errorClass || '_dog-error'
        }
    },
     provide() {
        return {
            dogErrors: this.dogErrors,
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
                else if (this.$dogForm.customRules && typeof this.$dogForm.customRules[rule] == 'function') {
                    error = this.$dogForm.customRules[rule](value, ruleValue)
                }
               
                if (error && error.type) {
                    const errorEl = document.createElement('div')
                    errorEl.classList.add(this.errorClass)
                    errorEl.innerHTML = this.$dogForm.message(error)
                    console.log(input.parentElement)
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
            return wrapper.querySelectorAll(`.${this.errorClass}`)
        },
        clearErrors() {
			const errorEls = this.getErrorEl(this.$refs.form);
			errorEls.forEach((e) => {
                if (!e.classList.contains('_df_ErrMsg')) {
                    e.remove()
                }
            });

			this.dogErrors.forEach((v) => {
				v.clear();
			});
		},
        dogSubmit(e) {
            this.inputs.forEach(i => {
                this.validateInput(i)
            })

            this.dogErrors.forEach(v => {
                v.validate()
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
        const inputClass = this.$dogForm.inputClass || 'vld'
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