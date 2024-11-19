<template>
  <div>
    <DForm @submit="handleSubmit"  focus-error :focus-offset="60" ref="dForm">
      <div>
        <div>Email</div>
        <input type="email" v-model="email" id="emailInput">
        <DError v-model="email" minlength="2" maxlength="16" validemail target="#emailInput" />
      </div>
      <div>
        <div>Password</div>
        <input type="password" v-model="password">
        <DError v-model="password" required />
      </div>
      <div>
        <div>Confirm Password</div>
        <input type="password" v-model="cpassword">
        <DError v-model="cpassword" :equalto="password" ref="cPasswordError" />
      </div>
      <div>
        <div>Age</div>
        <input type="number" v-model="age">
        <DError v-model="age" required min="18"/>
      </div>
      <div>
        <div>Photo</div>
        <input type="file" @change="handlePhoto" multiple>
        <DError v-model="photo" required accept="image/*" maxsize="2097152" />
      </div>
      <div>
        <button id="submitBtn">Submit</button>
        <button type="reset" @click="resetForm">Reset</button>
      </div>
    </DForm>

    <div style="margin-top: 20px;">
      <button @click="testCPass">Test</button>
      <button @click="toggleNativeValidate">toggleNativeValidate</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DogSubmitEvent } from './types/DogSubmitEvent';

const email = ref('')
const password = ref('')
const cpassword = ref('')

const age = ref()
const photo = ref()
const  handlePhoto = (e:Event) => {
  if (e.target && e.target instanceof HTMLInputElement) {
    console.log(e?.target?.files)
    photo.value = e.target.files
  }
}
const handleSubmit = (e: DogSubmitEvent) => {
  console.log(e)
}


const dForm = ref()
const  resetForm = () => {
  dForm.value.clearErrors()
}

const cPasswordError = ref()
const testCPass = () => {
  console.log(dForm.value.hasError())
  // let s = cPasswordError.value.validate()
}

const nativeValidate = ref(false)
const toggleNativeValidate = () => {
  nativeValidate.value = !nativeValidate.value
  console.log(nativeValidate.value)
}
</script>