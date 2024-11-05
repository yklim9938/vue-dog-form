<template>
    <div class="_df_ErrMsg" :class="$props.class" v-if="errorMsg">{{errorMsg}}</div>
</template>

<script setup>
import validation from '@/assets/validation'
import {ref, inject, onMounted, useAttrs, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Object, Array]
    },
    messages: {
        type: Object
    },
    target: {
        type: String
    }
})


/** Unique ID of this instance */
const instanceId = Math.random().toString()

/** Provided by DForm to hold all error instances. 
 * @type {Array}
*/
const errorInstances = inject('errorInstances')

onMounted(() => {
    errorInstances.push({
        id: instanceId,
        validate,
        clear
    })
})

onBeforeUnmount(() => {
    clear() // make sure added classes are removed
    const targetIndex = errorInstances.findIndex(d => d.id == instanceId)
    errorInstances.splice(targetIndex, 1)
})


/** plugin settings */
const $dForm = inject('$dForm')

/** The error message that will be rendered */
const errorMsg = ref('')

/** Attributes passed to this components */
const attrs = useAttrs()

/** Check whether modelValue has value */
const hasValue = () => {
    if (props.modelValue == undefined || props.modelValue == null) {
        return false
    }
    else if ((typeof props.modelValue == 'string' || Array.isArray(props.modelValue)) && props.modelValue.length == 0) {
        return false
    }
    return true
}

/** Check whether 'required' attribute is present and is not false */
const isRequired = () => {
    if (!('required' in attrs) || (typeof attrs.required == 'boolean' && !attrs.required)) {
        return false
    }
    return true
}

/** Provided by DForm, indicate whether validate function should run */
const isActive = inject('isActive')

const validate = () => {
    if (!isActive.value) {
        return
    }
    errorMsg.value = ''
    let inputEls = []
    if (props.target) {
        inputEls = document.querySelectorAll(props.target)
        inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
    }

    if (!hasValue() && !isRequired()) {
        return {}
    }

    let error = {}
    for (let rule in attrs) {
        let ruleVal = attrs[rule]
        
        if (validation[rule]) {
            error = validation[rule](props.modelValue, ruleVal)
        }
        else if (typeof $dForm.customRules == 'object' && typeof $dForm.customRules[rule] == 'function') {
            error = $dForm.customRules[rule](props.modelValue, ruleVal)
        }

        if (error && error.type) {
            if (props.messages && props.messages[error.type]) {
                errorMsg.value = props.messages[error.type]
                break
            }
            else {
                errorMsg.value = $dForm.message(error)
                break
            }
        }
    }

    if(error && error.type) {
        inputEls.forEach(ie => ie.classList.add('invalid'))
        error.els = inputEls
    }
    else if (!error.type && props.target) {
        inputEls.forEach(ie => ie.classList.add('valid'))
    }
    return error
}

const clear = () => {
    errorMsg.value = ''
    if (props.target) {
        let inputEls = document.querySelectorAll(props.target)
        inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
    }
}

watch(() => props.modelValue, () => {
    validate()
})

onMounted(() => {
    $dForm.autoValidate.forEach(rule => {
        watch(() => attrs[rule], () => {
            validate()
        })
    })
})

defineExpose({
    errorMsg,
    validate,
    clear
})
</script>