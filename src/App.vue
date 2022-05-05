
<template>
	<div>
		<AutoForm @submit="submitHandler" novalidate>
			<div>
				<div>Name</div>
				<input type="text" v-model="name" required minlength="2" class="vld">
				<!-- <AutoError v-model="name" required :messages="customMessage" minlength="2" spiderman></AutoError> -->
			</div>
			<div>
				<div>Email</div>
				<input type="email" v-model="email">
				<AutoError v-model="email" required validemail></AutoError>
			</div>
			<div>
				<div>Password</div>
				<input type="password" v-model="password">
				<!-- <AutoError v-model="password" required minlength="8"></AutoError> -->
			</div>
			<button type="submit">Submit</button>
		</AutoForm>
	</div>
</template>

<script setup>
import {ref} from 'vue'
const name = ref('')
const password = ref('')
const email = ref('')
const submitHandler = (e) => {
	console.log(e)
	return
}

const customMessage = {
	required: 'Name is required'
}
</script>
<style>
@import "./assets/base.css";
</style>
