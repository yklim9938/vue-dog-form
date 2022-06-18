<template>
  <form ref="form" @submit.prevent="dogSubmit" class="_dog-form" :novalidate="novalidate">
    <slot></slot>
  </form>
</template>

<script>
export default {
    inheritAttrs: false,
    name: 'DogForm',
    props: {
        novalidate: Boolean
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
            this.dogErrors.forEach(v => {
                let validity = v.validate()
                if (validity.type) errorCount++
            })

            e.isValid = errorCount < 1
            this.$emit('submit', e)
        }
    }
};
</script>