
<template>
	<div>
		<DForm @submit="submitHandler" novalidate ref="formRef">
			<div>
				<div>Name</div>
				<input type="text" v-model="name"/>
				<DError v-model="name" required :messages="customMessage" minlength="2" multipleof="3"/>
			</div>
			<div v-if="!noEmail">
				<div>Email</div>
				<input type="email" v-model="email" />
				<DError v-model="email" required validemail />
			</div>
			<div>
				<div>Password</div>
				<input type="password" v-model="password" required maxlength="32" />
				<DError v-model="password" required maxlength="32" />
			</div>
			<div>
				<div>Confirm Password</div>
				<input type="password" v-model="confirmPassword" />
				<DError v-model="confirmPassword" :equalto="password" maxlength="32" ref="cpErr" />
			</div>
			<div>
				<div>File</div>
				<input type="file" multiple accept="image/*" @change="fileChange" />
				<DError v-model="file" accept="image/*" maxsize="2097152" maxfile="2" required />
			</div>
			<button type="submit">Submit</button>
			<div>
				<button type="reset" @click="clearForm">Reset</button>
			</div>
		</DForm>
			<div>
				<button type="button" @click="noEmail = !noEmail">No Email</button>
			</div>
	</div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
const customMessage = {
	required: 'Name is required',
}
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const cpErr = ref(null)
watch(password, (newValue, oldValue) => {
    if (newValue && confirmPassword) {
        nextTick(() => { // wait for <DogError> to take up the new password
            cpErr.value.validate()
        })
    }
})
const email = ref('')
const file = ref('')
const fileChange = (e) => {
	console.log(e)
	file.value = e.target.files
}

const submitHandler = (e) => {
	console.log(e)
	return
}

const formRef = ref(null)
const clearForm = (e) => {
	// nextTick(() => { // wait for <DogError> to take up the new password
		formRef.value.clearErrors()
	// })
}

const noEmail = ref(false)

</script>
<style>
@import "./assets/base.css";
</style>
