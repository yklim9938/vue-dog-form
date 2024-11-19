import type { ErrorMessages } from "./ErrorMessages";
import type { ErrorObject } from "./ErrorObject";
import type { RuleEntry } from "./RuleEntry";
import type { DogFormActivate } from "./DogFormActivate";

export default interface DogFormOptions {
    defaultMessages?: ErrorMessages,
    message?: (error: ErrorObject) => string,
    customRules?: {
        [key: string]: RuleEntry
    },
    activate?: DogFormActivate,
    nativeValidate?: boolean
}