import type { ValidationResponse } from "./ValidationResponse";

export interface RuleEntry {
    rule: (val: any, validateValue?: any) => ValidationResponse,
    message: string,
    auto?: boolean
}