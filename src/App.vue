
<template>
	<div>
		<DForm @submit="submitHandler" novalidate ref="formRef" focus-error :focus-offset="40" activate="always">
			<div>
				<div>Name</div>
				<input type="text" name="name" v-model="name"/>
				<DError v-model.trim="name" :messages="customMessage" minlength="2" multipleof="3" target='[name="name"]' />
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
				<DError v-model="confirmPassword" :equalto="password" maxlength="32" />
			</div>
			<div>
				<div>Quantity</div>
				<input type="number" v-model="qty">
				<DError v-model="qty" required max="3" ref="numErrRef" />
				<div>
					<button type="button" @click="numErrRef.validate()">Validate Number</button>
				</div>
			</div>
			<div>
				<div>File</div>
				<input type="file" multiple accept="image/*" @change="fileChange" />
				<DError v-model="file" accept="image/*" maxsize="2097152" maxfile="2" required />
			</div>
			<div>
				<input type="checkbox" value="sd" v-model="checkboxValue">
				<DError v-model="checkboxValue" required />
			</div>
			<div>
				<div>Select</div>
					<select v-model="selectVal">
					<option value="">please select</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
				<DError v-model="selectVal" required />
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
import { ref } from 'vue'
const customMessage = {
	required: 'Name is required',
}
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')

const qty = ref()

const file = ref('')
const fileChange = (e) => {
	console.log(e)
	file.value = e.target.files
}

const submitHandler = (e) => {
	console.log(e.isValid)
	return
}

const formRef = ref(null)
const clearForm = (e) => {
	formRef.value.clearErrors()
}

const noEmail = ref(false)

const selectVal = ref()

const checkboxValue = ref([])

const numErrRef = ref()
</script>
<style>
@import "./assets/base.css";
input {
	outline: none;
	border: 1px solid grey;
}
input.invalid {
	border: 1px solid red;
}
input.valid {
	border: 1px solid green;
}
</style>
