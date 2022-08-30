# Vue-Dog-Form 🐶

Simplest yet flexible form validation plugin for Vue 3.

✔ Works with custom component inputs
✔ Custom validations 
✔ Lightweight

## Installation

```
npm i vue-dog-form
```

### Vue 3

In main.js
```
import { createApp } from 'vue'
import App from './App.vue'
import {DForm, DError, $dForm} from 'vue-dog-form'

const app = createApp(App)
app.component('DForm', DForm)
app.component('DError', DError)
app.config.globalProperties.$dForm = $dForm // mandatory

app.mount('#app')
```

### Nuxt 3

Create a plugin ```plugins/DogForm.js``` with the following content:
```
import {DForm, DError, $dForm} from 'vue-dog-form'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('DForm', DForm)
    nuxtApp.vueApp.component('DError', DError)
 
    return {
        provide: {
            dForm: $dForm
        }
    }
})
```

## Basic Usage

1. Build your form as usual, but wrap it in a ```<DForm>``` component.
2. Add `<DError>` with validation attributes. 

```
<DForm @submit="submitHandler">
    <div>
        <label>Name</label>
        <input type="text" v-model="name">
        <DError v-model="name" required minlength="3"/>
    </div>
    <div>
        <label>Password</label>
        <input type="password" v-model="password">
        <DError v-model="password" required/>
    </div>
    <button type="submit">Submit</button>
</DForm>

<script setup>
const submitHandler = (e) => {
    // You don't have to call e.preventDefault(). It's prevented automatically.

    if (!e.isValid) return // stop if form is not valid

    // whatever you want to do if form is valid
}
</script>
```

**Note** *By default, error messages has no styling. You can style it with the ```._df_ErrMsg``` class.

## Built-In Validations

- ```required```
- ```minlength="3"```
- ```maxlength="10"```
- ```min="1"```
- ```max="5"```
- ```accept="image/*"``` (for validating file types in file input)
- ```maxfile="2"``` (set the maximum number of files allowed in file input)  [Example](#File-Input-Validations)
- ```maxsize="5242880"``` *5Mb* (set the maximum file size **bytes** allowed in file input)
- ```validemail``` (input value must be an email)
- ```:equalto="otherState"``` (input value must equal to the value of *otherState*, useful for confirming password) [Example](#Password-And-Confirm-Password)

## Custom validation message
Use `messages` prop to show custom validation messages.
```
<DError v-model="name" required minlength="2" :messages="customMessage" />

<script setup>
const customMessage = {
    required: 'Name is required',
}
// since minlength is not specified in 'customMessage', it will use the default validation message
</script>
```

## Adding Class to Inputs

Use the `target` prop on `<DError>` as css selector to select elements. Selected elements will have `.invalid` class added when the input is invalid, `.valid` when valid.
```
<input type="email" id="emailInput" v-model="name"/>
<DError v-model="name" required validemail target="#emailInput" />
```

## Clearing Form Errors

You can call the `clearErros()` method on `<DForm>` to clear all errors.
```
<DForm ref="formRef">
    <!-- ...your inputs -->
    <button type="reset" @click="clearForm">Reset</button>
</DForm>

<script setup>
const formRef = ref(null)
const clearForm = (e) => {
    formRef.value.clearErrors()
}
</script>
```
## Configurations

You can change configuration of DogForm in ```$dForm``` after importing.

```
import {DForm, DError, $dForm} from 'vue-dog-form'
// $dForm holds all the configuration
```

### Default structure of ```$dForm```:
```
{
    validationMessages: { // Default validation messages
        required: "This field is required.",
        minlength: "Input must be at least {n} characters.",
        maxlength: "Input cannot be more than {n} characters.",
        equalto: "Input does not match.",
        validemail: "Please enter a valid email.",
        min: "Minimum value is {n}.",
        max: "Maximum value is {n}.",
        accept: "File(s) extension is not accepted.",
        maxfile: "Please select not more than {n} files.",
        maxsize: "File(s) must less than {n}Mb."
    },
    message(error) {
        // generate validation message based on the error type
        return error.value?.n ? this.validationMessages[error.type].replace(/{n}/g, error.value.n) : this.validationMessages[error.type] || error.type
    }
}
```

## Configuration Examples

### Changing default validation message globally

E.g. Change the default validation message for *required* validation
```
$dForm.validationMessages.required = 'Please fill in.'
```

Alternatively, you can overwrite the whole ```validationMessage``` with your own set of messages.

### Translating validation message

#### Using vue-i18n
in main.js

```
import { createApp } from 'vue'
import App from './App.vue'
import {DForm, DError, $dForm} from 'vue-dog-form'
import { createI18n } from 'vue-i18n'

const messages = {
    cn: {
        error_required: "这是必填栏。",
        error_minlength: "输入至少要有 {n} 个字符。",
        error_maxlength: "输入不可超过 {n} 个字符。",
        error_equalto: "输入必须匹配。",
        error_validemail: "请输入有效的电邮。",
        error_min: "最小值为 {n}。",
        error_max: "最大值为 {n}。",
        error_accept: "副档不被接受。",
        error_maxfile: "请选择不多于 {n} 个文件。",
        error_maxsize: "文件必须少于 {n}Mb。"
    }
}

const i18n = createI18n({
    locale: 'cn', // set locale
    fallbackLocale: 'cn', // set fallback locale
    messages
})
app.use(i18n)

$dForm.message = (error) => {
    const translateKey = `error_${error.type}`
    return error.value?.n ? i18n.global.t(translateKey, {n : error.value.n}) : i18n.global.t(translateKey)    
}

app.component('DForm', DForm)
app.component('DError', DError)
app.config.globalProperties.$dForm = $dForm

app.mount('#app')
```

### Add custom validation rules
E.g. Add a custom attribute that checks whether input value is multiple of 3.

```
<input type="number" v-model="answer">
<DError v-model="answer" multiple="3" />
```

```
$dForm.customRules = {
    multipleof(val, validateValue) {
        // val is your input's value,
        // validateValue is the value you passed in the attribute, in this case, 3
        if (Number(val) % validateValue != 0) { // condition for invalid value
        // must return an object with 'type' key
            return {
                type: 'multipleof',
                value: {
                    n: validateValue
                }
            }
        }
        return {} // return empty object if there's no error
    }
}

$dForm.validationMessages.multipleof = 'Value must be multiple of {n}'
```

**Note** *validation attributes must be small caps

## Usage Examples

### Password And Confirm Password

```
<div>
    <label>Password</label>
    <input type="password" v-model="password">
</div>
<div>
    <label>Confirm Password</label>
    <input type="password" v-model="confirmPassword" />
    <DError v-model="confirmPassword" :equalto="password" />
</div>
```

### File Input Validations

```
<input type="file" multiple @change="fileChange">
<DError v-model="file"  maxsize="2097152" maxfile="2" required />

<script setup>
const file = ref('')

const fileChange = (e) => {
    file.value=e.target.files
}
</script>
```

### Remove browser's default validation

Simply add a ```novalidate``` attribute on ```DForm```

```
<DForm @submit="submitHandler" novalidate>
<!-- Your inputs -->
</DForm>
```

### Scroll to invalid input

By adding `focus-error` prop on `<DForm>`, invalid inputs can be automatically scrolled into view upon form submission.

```
<DForm @submit="handleSubmit" focus-error>
    <input type="text" v-model="name" id="nameInput" />
    <DError v-model="name" required target="#nameInput" />
</DForm>
```

*It's actually scrolling to the element specified by `target` in `<DError>`. Therefore `target` is needed for this work.

**Offsetting scroll**

We can offset the scroll position by using `focus-offset`. This is useful if you have a floating header that covers the input after scrolling.

```
<DForm @submit="handleSubmit" focus-error :focus-offset="90">
```

This will offset the scroll position by 90px.

---

Made by [yklim](https://www.buymeacoffee.com/yklim) 😊