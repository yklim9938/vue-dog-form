
import type { InjectionKey, Ref } from 'vue'
import type { DErrorInstanceLink } from './DErrorInstanceLink'
import type { ErrorObject } from './ErrorObject'
import type { RuleEntry } from './RuleEntry'
import type { DogFormActivate } from './DogFormActivate'

const dogFormKey = Symbol() as InjectionKey<{
    message: (error: ErrorObject) => string,
    validationRules: {
        [key: string]: RuleEntry
    },
    activate: DogFormActivate,
    nativeValidate: boolean
}>
const errorInstancesKey = Symbol() as InjectionKey<DErrorInstanceLink[]>
const isActiveKey = Symbol() as InjectionKey<Ref<boolean>>

export {
    dogFormKey,
    errorInstancesKey,
    isActiveKey
}
