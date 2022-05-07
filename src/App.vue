
<template>
	<div>
		<DogForm @submit="submitHandler" novalidate>
			<div>
				<div>Name</div>
				<input type="text" v-model="name" required minlength="2">
				<DogError v-model="name" required :messages="customMessage" minlength="2" spiderman></DogError>
			</div>
			<div>
				<div>Email</div>
				<input type="email" v-model="email">
				<DogError v-model="email" required validemail></DogError>
			</div>
			<div>
				<div>Password</div>
				<input type="password" v-model="password">
				<!-- <DogError v-model="password" required minlength="8"></DogError> -->
			</div>
			<div>
				<div>Confirm Password</div>
				<input type="password" v-model="confirmPassword">
				<DogError v-model="confirmPassword" required :equalto="password" ></DogError>
			</div>
			<button type="submit">Submit</button>
		</DogForm>
	</div>
</template>

<script setup>
import {ref} from 'vue'
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')

const submitHandler = (e) => {
	console.log(e)
	return
}

const customMessage = {
	required: 'Name is required',
}
</script>
<style>
@import "./assets/base.css";
</style>
