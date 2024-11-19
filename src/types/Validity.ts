import type { ErrorObject } from "./ErrorObject"

interface ValidityObject extends ErrorObject {
    errorElements?:  NodeListOf<Element>
}

export type Validity = ValidityObject | void