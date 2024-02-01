
<template>
	<div>
		<DForm @submit="submitHandler" novalidate ref="formRef" focus-error :focus-offset="40">
			<div>
				<div>Name</div>
				<input type="text" name="name" v-model="name" @input="inputChange"/>
				<DError v-model="name" :messages="customMessage" multipleof="3" target='[name="name"]' required />
			</div>
			<div v-if="!noEmail">
				<div>Email</div>
				<input type="email" v-model="email" />
				<DError v-model="email" validemail />
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
				<div>Quantity</div>
				<input type="number" v-model="qty">
				<DError v-model="qty" max="0" />
			</div>
			<div>
				<div>File</div>
				<input type="file" multiple accept="image/*" @change="fileChange" @input="inputChange" />
				<DError v-model="file" accept="image/*" maxsize="2097152" maxfile="2" required />
			</div>
			<div>
				<div>Select</div>
				<select @input="inputChange">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</div>
			<div>
				<input type="radio" id="html" name="fav_language" value="HTML" @input="inputChange">
				<label for="html">HTML</label><br>
				<input type="radio" id="css" name="fav_language" value="CSS" @change="inputChange">
				<label for="css">CSS</label><br>
				<input type="radio" id="javascript" name="fav_language" value="JavaScript" @change="inputChange">
				<label for="javascript">JavaScript</label>
			</div>
			<div>
				<label for="favcolor">Select your favorite color:</label>
				<input type="color" id="favcolor" name="favcolor" @change="inputChange">
			</div>
			<div>
				<label for="birthday">Birthday:</label>
				<input type="date" id="birthday" name="birthday" @input="inputChange">
			</div>
			<div>
				<input type="checkbox" value="sd" @input="inputChange">
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

const inputChange = (e) => {
	console.log(e.target.value)
}
const customMessage = {
	required: 'Name is required',
}
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
/* const cpErr = ref(null)

watch(password, (newValue, oldValue) => {
    if (newValue && confirmPassword.value) {
        nextTick(() => { // wait for <DogError> to take up the new password
            cpErr.value.validate()
        })
    }
}) */
const email = ref('')

const qty = ref(0)

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
		formRef.value.clearErrors()
}

const noEmail = ref(false)

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
