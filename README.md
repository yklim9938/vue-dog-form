# Vue-Dog-Form 🐶

Simplest yet flexible form validation plugin for Vue 3.

✔ No more validation schema object, use native html-like validation attributes.

✔ Compatible with any custom input components.

✔ Support custom validation rules and messages. 

✔ Lightweight, less than 3kb gzipped.

---

## Getting Started

### 1. Installation

```bash
$ npm i vue-dog-form
```

### 2. Import into your project as Vue Plugin

#### Vue 3

In `/src/main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import dogForm from 'vue-dog-form'

const app = createApp(App)
app.use(dogForm)
app.mount('#app')
```

#### Nuxt 3

Create a `dogForm.js` file under `plugins` folder with the following content:

```js
import dogForm from 'vue-dog-form'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(dogForm)
})
```

---
### Basic Usage

1. Build your form as usual, but wrap it in a `<DForm>` component.
2. Add `<DError>` with validation attributes.

```vue
<template>
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
</template>

<script setup lang="ts">
const submitHandler = (e: DogSubmitEvent) => {
    // You don't have to call e.preventDefault(). It's prevented automatically.

    if (!e.isValid) return // stop if form is not valid

    // whatever you want to do if form is valid
}
</script>
```

**Note** *By default, error messages has no styling. You can style it with the ```._df_ErrMsg``` class.

---

### How It Works

When the `v-model` in `<DError>` changes, the value will be validated with it's attributes. If the value is invalid, `<DError>` will render the corresponding error message.

During form submission, `<DForm>` will pick up the event and trigger all nested `<DError>` to run validation again.

The `isValid` property in the submit event indicates whether the form is valid.

---

## Components

### `<DForm>`

#### Props

| Name | Info | Type | Default |
| -- | -- | -- | -- |
| native-validate | Enable browser's native form validation. | boolean | false |
| focus-error | Auto scroll to invalid input upon form submission. See [Example](#Scroll-to-invalid-input) | boolean | false |
| focus-offset | The offset position for auto scroll. See [Example](#Offsetting-scroll). | number | 0 |
| activate | Specify when should the validation happen. See [Example](#When-to-validate) | string | 'always'

#### Methods

##### clearErrors()

Removes all error messages by calling the clear() method on every `<DError>`.

##### hasError()

Returns `true` if there's error in the form.

---

### `<DError>`

#### Props

| Name | Info | Type |
| -- | -- | -- |
| v-model | *Required. The value of your input. | any | 
| messages | Custom validation messages. See [Example](#Custom-validation-message). | object |
| target | The css selector to select associated html elements. See [Example](#Adding-class-to-inputs). | string |

#### Methods

##### validate()

Validates the input. If the value is invalid, an error message will be shown. If `target` prop is provided, matched elements will have .invalid or .valid class.

##### clear()
Clears the error message. Also removes .invalid and .valid class from matched target.

---

## Built-in Validations

Vue Dog Form provides some built-in validations which are similar to native html validation attributes:

- ```required```
- ```minlength="3"```
- ```maxlength="10"```
- ```min="1"```
- ```max="5"```
- ```accept="image/*"``` (for validating file types in file input)
- ```maxfile="2"``` (set the maximum number of files allowed in file input)  [Example](#File-Input-Validations)
- ```maxsize="5242880"``` *5Mb* (set the maximum file size **bytes** allowed in file input)
- ```validemail``` (input value must be an email)
- ```:equalto="otherState"``` (input value must be the same as *otherState*, useful for confirming password) [Example](#Password-And-Confirm-Password)
- ```:notequalto="otherState"``` (input value cannot be the same as *otherState*)

## Configurations

You can modify DogForm's behavior with `app.use()`.

```js
app.use(dogForm, {
    ... options
})
```

`options` having the following interface

```ts
interface DogFormOptions {
    defaultMessages?: ErrorMessages,
    message?: (error: ErrorObject) => string,
    customRules?: {
        [key: string]: RuleEntry
    },
    activate?: 'always' | 'first_submit' | 'only_submit' | 'never',
    nativeValidate?: boolean
}
```

### defaultMessages

Overwrites default validation messages globally.

E.g. Overwriting  message for `required`.

```js
app.use(dogForm, {
    defaultMessages: {
        required: `Don't be lazy.`
    }
})'
```

### message(error)

The function to generate validation message. The `error` object has the following properties:

| Parameters | Info |Type | Examples
| -- | -- | -- | -- |
| type | The failed validation type. | string | "required", "minlength"
| value | The expected valid value. | object | {n: 3} *when minlength="3" |

By default, Vue Dog Form will read the `type` and `value.n` to generate validation message.

E.g. Translating messages with vue-i18n:

In main.js

```js
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

app.use(dogForm, {
    message(error) {
        const translateKey = `error_${error.type}`
        return error.value?.n ? i18n.global.t(translateKey, {n : error.value.n}) : i18n.global.t(translateKey)    
    }
})
```

### customRules

Add custom validation rules.

Entries for `customRules` must satisty this interface

```ts
interface RuleEntry {
    rule: (val: any, validateValue?: any) => ValidationResponse,
    message: string,
    auto?: boolean
}
```

E.g. Add a custom attribute that checks whether input value is a multiple of 3.

```vue
<input type="number" v-model="answer">
<DError v-model="answer" multipleof="3" />
```

```js
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
            },
            message: 'Value must be multiple of {n}',
        }
    }
})
```

**Note** the `auto` property in `RuleEntry`. When set to true, `DError` will automatically run validation when the value specified in attribute changes. This is useful when the validation involves other dynamic states. The builit-in validations "equalto" and "notequalto" were set to `auto:true`. See [example](#Password-And-Confirm-Password)

### activate

Globally set the default value of `activate` prop for `<DForm>`.

### nativeValidate

Globally set the default value of `native-validate` prop for `<DForm>`.

## Examples

### Custom validation message

Use `messages` prop to show custom validation messages.

```vue
<template>
    ...
    <DError v-model="name" required minlength="2" :messages="customMessage" />
</template>


<script setup>
const customMessage = {
    required: 'Name is required',
}
// since minlength is not specified in 'customMessage', it will use the default validation message
</script>
```

### Adding class to inputs

Use the `target` prop on `<DError>` as css selector to select elements. Selected elements will have `.invalid` class added when the input is invalid, `.valid` when valid.
```vue
<input type="email" id="emailInput" v-model="name"/>
<DError v-model="name" required validemail target="#emailInput" />
```


### Enabling browser's default validation

Simply add a ```native-validate``` attribute on ```<DForm>```

```vue
<DForm @submit="submitHandler" native-validate>
<!-- Your inputs -->
</DForm>
```

### Scroll to invalid input

By adding `focus-error` prop on `<DForm>`, invalid inputs can be automatically scrolled into view upon form submission. This is useful when you have a long form.

```vue
<DForm @submit="handleSubmit" focus-error>
    <input type="text" v-model="name" id="nameInput" />
    <DError v-model="name" required target="#nameInput" />
</DForm>
```

*It's actually scrolling to the element specified by `target` in `<DError>`. Therefore the `target` prop is needed for this to work.

#### Offsetting scroll

We can offset the scroll position by using `focus-offset`. This is useful if you have a floating header that covers the input after scrolling.

```vue
<DForm @submit="handleSubmit" focus-error :focus-offset="90">
```

This will offset the scroll position by 90px.

#### When to validate

The `activate` props controls the validation behaviour. The value could be
 
 - "always" - Validate everytime the v-model changes. (default)
 - "first_submit" - Only start to validate on the first form submission, and then behave like "always".
 - "only_submit" - Only validate during form submissions.
 - "never" - Disable validation. `e.isValid` from the submit event will always be `true`
 
```vue
<DForm activate="first_submit">
```

### Clearing Form Errors

Calling the `clearErrors()` method on `<DForm>` to clear all errors.
```vue
<template>
    <DForm ref="formRef">
        <!-- ...your inputs -->
        <button type="reset" @click="clearForm">Reset</button>
    </DForm>
</template>

<script setup>
const formRef = ref(null)
const clearForm = (e) => {
    formRef.value.clearErrors()
}
</script>
```

### File Input Validations

```vue
<template>
    <input type="file" multiple @change="fileChange">
    <DError v-model="file"  maxsize="2097152" maxfile="2" required />
</template>

<script setup>
const file = ref('')

const fileChange = (e) => {
    file.value = e.target.files
}
</script>
```

### Password And Confirm Password

```vue
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

---

Made by [yklim](https://github.com/yklim9938) 😊
