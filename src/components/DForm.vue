<template>
  <form ref="formEl" @submit.prevent="dogSubmit" class="_dog-form" :novalidate="novalidate">
    <slot></slot>
  </form>
</template>

<script setup>
import { provide, ref, onBeforeMount, watch } from 'vue'
defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    novalidate: {
        type: Boolean,
        default: false,
    },
    focusError: {
        type: Boolean,
        default: false
    },
    focusOffset: {
        type: Number,
        default: 0
    },
    activate: {
        type: [String, Boolean],
        default: 'always' // 'always', 'first_submit', 'only_submit', 'never'
    }
})

const formEl = ref()

/** Contains all the DError instances when they are mounted.  */
let errorInstances = []
provide('errorInstances', errorInstances)

/** Removes the error message in all DError instances and .invalid class from their targets */
const clearErrors = () => {
    errorInstances.forEach((v) => {
        v.clear();
    })
}

defineExpose({
    clearErrors,
    formEl: formEl.value
})

/** Indicate whether validate function should run */
const isActive = ref(true)
provide('isActive', isActive)

const setActive = () => {
    if (!props.activate || props.activate == 'first_submit' || props.activate == 'only_submit' || props.activate == 'never') {
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

/**
 * The onsubmit handler, which will emit vue's custom "@submit" event.
 * @param {*} e - The event data
 */
const dogSubmit = (e) => {
    if (!isActive.value) {
        if (props.activate == 'never' || !props.activate) {
            e.isValid = true
            emit('submit', e)
            return
        }
        isActive.value = true
    }

    let errorCount = 0
    let errorInput = null
    errorInstances.forEach(v => {
        let validity = v.validate()
        if (validity.type) {
            errorCount++
            if (!errorInput && validity.els && validity.els.length > 0) {
                errorInput = validity.els[0]
            }
        }
    })

    e.isValid = errorCount < 1
    if (props.focusError && errorInput) {
        const elPos = errorInput.getBoundingClientRect().top;
        const offset = props.focusOffset || 0
        window.scrollTo({
            top: elPos + window.scrollY - offset,
            behavior: "smooth"
        });
    }
    emit('submit', e)

    if (props.activate == 'only_submit') {
        isActive.value = false
    }
}

const emit = defineEmits(['submit'])
</script>