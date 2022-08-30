# Vue-Dog-Form 🐶

Simplest yet flexible form validation plugin for Vue 3.

✔ No more validation schema object, use native html-like validation attributes.
✔ Works with custom component inputs.
✔ Support custom validation rules and messages. 
✔ Lightweight, less than 3kb gzipped.

## Installation

```
npm i vue-dog-form
```

### Vue 3

In main.js
```
import { createApp } from 'vue'
import App from './App.vue'
import dogForm from 'vue-dog-form'

const app = createApp(App)
app.use(dogForm)
app.mount('#app')
```

### Nuxt 3

Create a plugin ```plugins/DogForm.js``` with the following content:
```
import dogForm from 'vue-dog-form'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(dogForm)
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

You can change configuration of DogForm by passing `options` on `app.use()` in main.js.

```
app.use(dogForm, options)
```

## Configuration Examples

### Changing default validation message globally
You can overwrite default validation message within the `defaultMessages` property in `options`.

E.g. Overwriting *required* validation message.
```
app.use(dogForm, {
    defaultMessages: {
        required: `Don't be lazy.`
    }
})'
```

### Translating validation message
Pass in a `message(error)` function that returns the corresponding validation message.

E.g. Using vue-i18n, in main.js

```
import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import dogForm from 'vue-dog-form'

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

app.use(dogForm, {
    message(error) {
        const translateKey = `error_${error.type}`
        return error.value?.n ? i18n.global.t(translateKey, {n : error.value.n}) : i18n.global.t(translateKey)    
    }
})

app.mount('#app')
```

### Adding custom validation rules
You can add in custom validations with the `customRules` property.

E.g. Add a custom attribute that checks whether input value is a multiple of 3.

```
<input type="number" v-model="answer">
<DError v-model="answer" multiple="3" />
```

```
app.use(dogForm, {
    customRules: {
        multipleof: {
            rule(val, validateValue) {
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
                return {}
            },
            message: 'Value must be multiple of {n}'
        }
    }
})
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
    file.value = e.target.files
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