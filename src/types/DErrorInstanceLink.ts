import type {Ref} from 'vue'
import type { Validity } from './Validity'

export interface DErrorInstanceLink {
    id: string,
    errorMessage: Ref<string>
    validate: (force?: boolean) => Validity,
    clear: () => void,
}