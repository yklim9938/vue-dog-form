<template>
    <div :class="errorClass" v-if="errorMsg">{{errorMsg}}</div>
</template>

<script>
import validation from '@/assets/validation'

export default {
    name: 'AutoError',
    inject: ['autoErrors'],
    props: {
        modelValue: [String, Number, Object, Array],
        messages: Object,
    },
    data() {
        return {
            errorMsg: '',
            errorClass: this.$autoForm.errorClass || 'vld-error'
        }
    },
    methods: {
        validate() {
            this.errorMsg = ''
            if (this.modelValue != undefined && this.modelValue != null) {
                if (!('required' in this.$attrs) && typeof this.modelValue == 'string' && this.modelValue.length < 1) return {}
                let error = {}
             
                for (let rule in this.$attrs) {
                    let ruleVal = this.$attrs[rule]
                    
                    if (validation[rule]) {
                        error = validation[rule](this.modelValue, ruleVal)
                    }
                    else if (this.$autoForm.customRules && typeof this.$autoForm.customRules[rule] == 'function') {
                        error = this.$autoForm.customRules[rule](this.modelValue, ruleVal)
                    }
                    if (error && error.type) {
                        if (this.messages && this.messages[error.type]) {
                            this.errorMsg = this.messages[error.type]
                            break
                        }
                        else {
                            this.errorMsg = this.$autoForm.message(error)
                            break
                        }
                    }
                }
                return error
            }
        }
    },
    mounted() {
        this.autoErrors.push(this.validate)
    },
    watch: {
        modelValue() {
            this.validate()
        }
    }
}
</script>