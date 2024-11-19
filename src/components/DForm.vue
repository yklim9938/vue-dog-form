<template>
    <form @submit.prevent="dogSubmit" class="_dog-form" :novalidate="!enableNativeValidate">
        <slot></slot>
    </form>
</template>

<script setup lang="ts">
import { ref, provide, onBeforeMount, watch, inject} from 'vue'
import { errorInstancesKey, isActiveKey, dogFormKey } from '@/types/provides'
import type { DErrorInstanceLink } from '@/types/DErrorInstanceLink'
import type { DogSubmitEvent } from '@/types/DogSubmitEvent';
import type { DogFormActivate } from '@/types/DogFormActivate';

defineOptions({
    inheritAttrs: false
})

interface Props {
    nativeValidate?: boolean | undefined,
    focusError?: boolean,
    focusOffset?: number,
    activate?: DogFormActivate
}

const props = withDefaults(defineProps<Props>(), {
    focusError: false,
    focusOffset: 0,
    nativeValidate: undefined
})

const emit = defineEmits<{
    (event:'submit', payload: DogSubmitEvent): void
}>()

/** Contains all the DError instances' common useful properties and methods when they are mounted. */
let errorInstances : DErrorInstanceLink[] = []
provide(errorInstancesKey, errorInstances)

/** Removes the error message in all DError instances and .invalid class from their targets */
const clearErrors = () => {
    errorInstances.forEach((v) => {
        v.clear()
    })
}

const $dForm = inject(dogFormKey)

/** Indicate whether validate function should run, related to props.activate */
const isActive = ref(true)
provide(isActiveKey, isActive)
const setActive = () => {
    let source = typeof props.activate == 'string' ? props.activate : ($dForm?.activate || 'always')
    if (!source || source == 'first_submit' || source == 'only_submit' || source == 'never') {
        isActive.value = false
        clearErrors()
    }
    else {
        isActive.value = true
    }
}
onBeforeMount(() => {
    setActive()
})
watch(() => props.activate, () => {
    setActive()
})

const enableNativeValidate = ref(false)
const setNativeValdate = () => {
    if (typeof props.nativeValidate == 'boolean') {
        enableNativeValidate.value = props.nativeValidate
        return
    }
    else if (typeof $dForm?.nativeValidate == 'boolean') {
        enableNativeValidate.value = $dForm.nativeValidate
    }
    else {
        enableNativeValidate.value = false
    }
}
onBeforeMount(() => {
    setNativeValdate()
})
watch(() => props.nativeValidate, () => {
    setNativeValdate()
})

const dogSubmit = (formSubmitEvent: DogSubmitEvent) => {
    if (!isActive.value) {
        if (props.activate == 'never') {
            formSubmitEvent.isValid = true
            emit('submit', formSubmitEvent)
            return
        }
        isActive.value = true
    }

    let errorCount = 0
    let errorInput = null as unknown as Element
    errorInstances.forEach(v => {
        let validity = v.validate()
        if (validity?.type) {
            errorCount++
            if (!errorInput && validity.errorElements && validity.errorElements.length > 0) {
                errorInput = validity.errorElements[0]
            }
        }
    })

    formSubmitEvent.isValid = errorCount < 1
    if (props.focusError && errorInput) {
        const elPos = errorInput.getBoundingClientRect().top;
        const offset = props.focusOffset || 0
        window.scrollTo({
            top: elPos + window.scrollY - offset,
            behavior: "smooth"
        });
    }
    emit('submit', formSubmitEvent)

    if (props.activate == 'only_submit') {
        isActive.value = false
    }
}

const hasError = () => {
    let errorFound = false
    for (let i = 0; i < errorInstances.length; i++) {
        if (errorInstances[i].errorMessage.value) {
            errorFound = true
            break;
        }
    }
    return errorFound
}

defineExpose({
    clearErrors,
    hasError
})

</script>