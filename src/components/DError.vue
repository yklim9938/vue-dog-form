<template>
    <div class="_df_ErrMsg" :class="$props.class" v-if="errorMsg">{{errorMsg}}</div>
</template>

<script>
import validation from '@/assets/validation'

export default {
    name: 'DError',
    inject: ['dogErrors'],
    props: {
        modelValue: [String, Number, Object, Array],
        messages: Object,
        target: String
    },
    data() {
        return {
            errorMsg: '',
            id: Math.random().toString()
        }
    },
    methods: {
        validate() {
            this.errorMsg = ''
            let inputEls = []
            if (this.target) {
                inputEls = document.querySelectorAll(this.target)
                inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
            }
            if (this.modelValue != undefined && this.modelValue != null) {
                if ((!('required' in this.$attrs) || (typeof this.$attrs.required == 'boolean' && !this.$attrs.required)) && (typeof this.value == 'string' || Array.isArray(this.value)) && this.modelValue.length < 1) return {}
                let error = {}
             
                for (let rule in this.$attrs) {
                    let ruleVal = this.$attrs[rule]
                    
                    if (validation[rule]) {
                        error = validation[rule](this.modelValue, ruleVal)
                    }
                    else if (typeof this.$dForm.customRules == 'object' && typeof this.$dForm.customRules[rule] == 'function') {
                        error = this.$dForm.customRules[rule](this.modelValue, ruleVal)
                    }

                    if (error && error.type) {
                        if (this.messages && this.messages[error.type]) {
                            this.errorMsg = this.messages[error.type]
                            break
                        }
                        else {
                            this.errorMsg = this.$dForm.message(error)
                            break
                        }
                    }
                }
                if(error && error.type) {
                    inputEls.forEach(ie => ie.classList.add('invalid'))
                }
                else if (!error.type && this.target) {
                    inputEls.forEach(ie => ie.classList.add('valid'))
                }
                return error
            }
            return {}
        },
        clear() {
            this.errorMsg = ''
            if (this.target) {
                let inputEls = document.querySelectorAll(this.target)
                inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
            }
        }
    },
    mounted() {
        this.dogErrors.push({
            id: this.id,
            validate: this.validate,
            clear: this.clear
        })
    },
    beforeUnmount() {
        const targetIndex = this.dogErrors.findIndex(d => d.id == this.id)
        this.dogErrors.splice(targetIndex, 1)
    },
    watch: {
        modelValue() {
            this.validate()
        }
    }
}
</script>