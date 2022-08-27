<template>
  <form ref="form" @submit.prevent="dogSubmit" class="_dog-form" :novalidate="novalidate">
    <slot></slot>
  </form>
</template>

<script>
export default {
    inheritAttrs: false,
    name: 'DForm',
    props: {
        novalidate: Boolean,
        focusError: Boolean,
        focusOffset: Number
    },
    data() {
        return {
            dogErrors: []
        }
    },
    provide() {
        return {
            dogErrors: this.dogErrors,
        }
    },
    methods: {
        clearErrors() {
			this.dogErrors.forEach((v) => {
				v.clear();
			});
		},
        dogSubmit(e) {
            let errorCount = 0
            let errorInput = null
            this.dogErrors.forEach(v => {
                let validity = v.validate()
                if (validity.type) {
                    errorCount++
                    if (!errorInput && validity.els && validity.els.length > 0) {
                        errorInput = validity.els[0]
                    }
                }
            })

            e.isValid = errorCount < 1
            if (this.focusError && errorInput) {
                const elPos = errorInput.getBoundingClientRect().top;
                const offset = this.focusOffset || 0
                window.scrollTo({
                    top: elPos + window.pageYOffset - offset,
                    behavior: "smooth"
                });
            }
            this.$emit('submit', e)
        }
    }
};
</script>