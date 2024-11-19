<template>
    <div v-if="errorMsg" class="_df_ErrMsg" :class="$props.class">{{errorMsg}}</div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useAttrs, onBeforeUnmount, watch } from 'vue';
import { errorInstancesKey, isActiveKey, dogFormKey } from '@/types/provides'
import type { Validity } from '@/types/Validity';
import type { ErrorMessages } from '@/types/ErrorMessages';
import type { ErrorObject } from '@/types/ErrorObject';

interface Props {
    modelValue: any,
    messages?: ErrorMessages,
    target?: string
}

const props = defineProps<Props>()

/** Unique ID of this instance */
const instanceId = Math.random().toString()
const errorInstances = inject(errorInstancesKey)
onMounted(() => {
    errorInstances?.push({
        id: instanceId,
        validate: validate,
        clear: clear,
        errorMessage: errorMsg
    })
})

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


/** The error message that will be rendered */
const errorMsg = ref('')
const $dForm = inject(dogFormKey)
const isActive = inject(isActiveKey)

/**
 * Validates the input. If the value is invalid, an error message will be shown. If target prop is provided, matched elements will have .invalid or .valid class.
 */
const validate = (force?: boolean) : Validity => {
    if (!force && (!isActive || !isActive.value)) {
        return
    }
    errorMsg.value = ''
    let inputEls = [] as unknown as NodeListOf<Element>
    if (props.target) {
        inputEls = document.querySelectorAll(props.target)
        inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
    }

    if (!hasValue() && !isRequired()) {
        return
    }

    let error = {} as Validity

    for (let rule in attrs) {
        let ruleVal = attrs[rule]
        
        if ($dForm?.validationRules[rule]) {
            error = $dForm.validationRules[rule].rule(props.modelValue, ruleVal) as ErrorObject
            if (error && error.type) {
                if (props.messages && typeof props.messages[error.type] == 'string') {
                    errorMsg.value = props.messages[error.type]
                }
                else {
                    errorMsg.value = $dForm.message(error)
                }
                break;
            }
        }
    }
    if(error && error.type) {
        inputEls.forEach(ie => ie.classList.add('invalid'))
        error.errorElements = inputEls
    }
    else {
        inputEls.forEach(ie => ie.classList.add('valid'))
    }
    return error
}
watch(() => props.modelValue, () => {
    validate()
})
onMounted(() => {
    if (!$dForm?.validationRules) {
        return
    }

    // watch auto validation
    Object.keys(attrs).forEach(r => {
        if ($dForm.validationRules[r]?.auto) {
            watch(() => attrs[r], () => {
                validate()
            })
        }
    })

})

/**
 * clear errorMsg and remove all valid/invalid class on the target elements
 */
const clear = () => {
    errorMsg.value = ''
    if (props.target) {
        let inputEls = document.querySelectorAll(props.target)
        inputEls.forEach(ie => ie.classList.remove('invalid', 'valid'))
    }
}
onBeforeUnmount(() => {
    clear() // make sure added classes are removed
    const targetIndex = errorInstances?.findIndex(d => d.id == instanceId)
    if (typeof targetIndex == 'number' && targetIndex >= 0) {
        errorInstances?.splice(targetIndex, 1)
    }
})

defineExpose({
    errorMsg,
    validate,
    clear
})
</script>