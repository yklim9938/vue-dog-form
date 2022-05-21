# Vue-Dog-Form

Simplest yet flexible form validation plugin for Vue 3.

## Installation
```
npm i vue-dog-form
```

In main.js
```
import { createApp } from 'vue'
import App from './App.vue'
import {DogForm, DogError, $dogForm} from 'vue-dog-form'

const app = createApp(App)
app.component('DogForm', DogForm)
app.component('DogError', DogError)
app.config.globalProperties.$dogForm = $dogForm // mandatory

app.mount('#app')
```

## Basic Usage

1. Build your form as usual, but wrap it in a ```<DogForm>``` component.
2. Add a '.vld' class in the inputs that you want to validate.

```<DogForm>``` will automatically pick up attributes such as ```required``` and ```minlength``` and add validation message below the input.

```
<DogForm @submit="submitHandler">
    <div>
        <label>Name</label>
        <input type="text" v-model="name" required minlength="3" class="vld">
    </div>
    <div>
        <label>Password</label>
        <input type="password" v-model="password" required class="vld">
    </div>
    <button type="submit">Submit</button>
</DogForm>

<script setup>
const submitHandler = (e) => {
    // You don't have to call e.preventDefault(). It's prevented automatically.

    if (!e.isValid) return // stop if form is not valid

    // whatever you want to do if form is valid
}
</script>
```

## Built-In Validations
- ```required```
- ```minlength="3"```
- ```maxlength="10"```
- ```min="1"```
- ```max="5"```
- ```accept="image/*"``` (for validating file types in file input)
- ```maxfile="2"``` (set the maximum number of files allowed in file input)  [Example](#File-Input-Validations)
- ```maxsize="5242880"``` *5Mb* (set the maximum file size **bytes** allowed in file input)
- ```validnumber``` (input value can only have numbers)
- ```validemail``` (input value must be an email)
- ```:equalto="otherState"``` (input value must equal to the value of *otherState*, useful for confirming password)

## Validation for custom input components

Sometimes you have custom input components that don't support validation attributes. In this case, you can use the ```<DogError>``` component.

```
<CustomInput v-model="username"></CustomInput>
<DogError v-model="username" required maxlength="20"></DogError>
```

## Custom validation message
You must use ```<DogError>``` for custom validation message.
```
<DogError v-model="name" required minlength="2" :messages="customMessage"></DogError>

<script setup>
const customMessage = {
	required: 'Name is required',
}
</script>
```

## Configurations

You can change configuration of DogForm in ```$dogForm``` after importing.

```
import {DogForm, DogError, $dogForm} from 'vue-dog-form'
// $dogForm holds all the configuration
```

### Default structure of ```$dogForm```:
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
        maxsize: "File(s) must less than {n}Mb.",
        validnumber: "Input must be a number.",
    },
    message(error) {
        // the function that generate validation message based on the error type
        return error.value?.n ? this.validationMessages[error.type].replace(/{n}/g, error.value.n) : this.validationMessages[error.type] || error.type
    },
    inputClass: 'vld', // The class on the input for DogForm to pick up
    errorClass: '_dog-error' // The class of the error message element
}
```

## Configuration Examples

### Changing default validation message globally

E.g. Change the default validation message for *required* validation
```
$dogForm.validationMessages.required = 'Please fill in.'
```

Alternatively, you can overwrite the whole ```validationMessage``` with your own set of messages

### Translation for validation message

#### Using vue-i18n
in main.js

```
import { createApp } from 'vue'
import App from './App.vue'
import {DogForm, DogError, $dogForm} from 'vue-dog-form'
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
        error_maxsize: "文件必须少于 {n}Mb。",
        error_validnumber: "输入必须为数字。",
    }
}

const i18n = createI18n({
    locale: 'cn', // set locale
    fallbackLocale: 'cn', // set fallback locale
    messages
})
app.use(i18n)

$dogForm.message = (error) => {
    const translateKey = `error_${error.type}`
    return error.value?.n ? i18n.global.t(translateKey, {n : error.value.n}) : i18n.global.t(translateKey)    
}

app.component('DogForm', DogForm)
app.component('DogError', DogError)
app.config.globalProperties.$dogForm = $dogForm

app.mount('#app')
```

### Add custom validation rules
E.g. Add a custom attribute that check whether input value is multiple of 3

```
<input type="number" class="vld" multipleof="3">
```
```
$dogForm.customRules = {
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
    }
}

$dogForm.validationMessages.multipleof = 'Value must be multiple of {n}'
```

**Note** validation attributes must be small caps

## Usage Examples

### Password And Confirm Password

Use ```<DogError>```
```
<div>
	<label>Password</label>
	<input type="password" class="vld" v-model="password" required maxlength="32">
</div>
<div>
	<label>Confirm Password</label>
	<input type="password" v-model="confirmPassword" class="vld" :equalto="password" maxlength="32">
</div>
```

### File Input Validations

We cannot use v-model on file input. To validate file input, we must use ```<DogError>```.

```
<input type="file" multiple @change="fileChange">
<DogError v-model="file"  maxsize="2097152" maxfile="2" required></DogError>

<script setup>
const file = ref('')

const fileChange = (e) => {
	file.value=e.target.files
}
</script>
```

### Remove browser's default validation

Simply add a ```novalidate``` attribute on ```DogForm```

```
<DogForm @submit="submitHandler" novalidate>
<!-- Your inputs -->
</DogForm>
```

