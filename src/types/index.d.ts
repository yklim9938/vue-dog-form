import type {App, Plugin} from 'vue'
interface ErrorMessages {
    [key: string]: string
}

interface ErrorObject {
    type: string,
    value?: {
        n?: any
    }
}

type ValidationResponse = ErrorObject | void

interface RuleEntry {
    rule: (val: any, validateValue?: any) => ValidationResponse,
    message: string,
    auto?: boolean
}

type DogFormActivate = 'always' | 'first_submit' | 'only_submit' | 'never'

interface DogFormOptions {
    defaultMessages?: ErrorMessages,
    message?: (error: ErrorObject) => string,
    customRules?: {
        [key: string]: RuleEntry
    },
    activate?: DogFormActivate,
    nativeValidate?: boolean
}

declare const _default: {
    install: (app: any, options: DogFormOptions) => void;
};
export default _default;