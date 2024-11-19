import type { RuleEntry } from "@/types/RuleEntry";

const validations: {[key: string]: RuleEntry} = {
    required: {
        rule(val, validateValue) {
            if (val == null || val == undefined) {
                return {
                    type: 'required'
                }
            }
            else if (Array.isArray(val) || typeof val == 'string' || val instanceof FileList) {
                if (val.length < 1) {
                    return {
                        type: 'required'
                    }
                }
            }
            else if (typeof val == 'number') {
                if (isNaN(val)) {
                    return {
                        type: 'required'
                    }
                }
            }
            return
        },
        message: "This field is required.",
    },
    minlength: {
        rule(val, validateValue) {
            if (val.length < parseInt(validateValue)) {
                return {
                    type: 'minlength',
                    value: {
                        n: validateValue
                    }
                }
            }
        },
        message: "Input must be at least {n} characters."
    },
    maxlength: {
        rule(val, validateValue) {
            if (val.length > parseInt(validateValue)) {
                return {
                    type: 'maxlength',
                    value: {
                        n: validateValue
                    }
                }
            }
        },
        message: "Input cannot be more than {n} characters."
    },
    equalto: {
        rule(val, validateValue) {
            if (val != validateValue) {
                return {
                    type: 'equalto',
                }
            }
        },
        message: "Input value does not match.",
        auto: true
    },
    notequalto: {
        rule(val, validateValue) {
            if (val == validateValue) {
                return {
                    type: 'notequalto',
                }
            }
        },
        message: "Input value cannot be the same.",
        auto: true
    },
    validemail: {
        rule(val, validateValue) {
            const mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
            if (!val.match(mailFormat)) {
                return {
                    type: 'validemail'
                }
            }
        },
        message: "Please enter a valid email."
    },
    min: {
        rule(val, validateValue) {
            if (val < parseFloat(validateValue)) {
                return {
                    type: 'min',
                    value: {
                        n: validateValue
                    }
                }
            }
        },
        message: "Minimum value is {n}."
    },
    max: {
        rule(val, validateValue) {
            if (val > parseFloat(validateValue)) {
                return {
                    type: 'max',
                    value: {
                        n: validateValue
                    }
                }
            }
        },
        message: "Maximum value is {n}."
    },
    accept: {
        rule(val, validateValue) {
            const acceptList: string[] = validateValue.trim().split(',')
            let types: string[] = []
            let extensions: string[] = []
            acceptList.forEach((a, i) => {
                if (a.indexOf('/') > -1) {
                    types.push(a)
                }
                else {
                    let matches = a.match(/\.\w{1,}$/)
                    if (matches && matches[0]) {
                        extensions.push(matches[0])
                    }
                } 
            })
            let invalidFiles = []
            const files = val
            for (let f = 0; f < files.length; f++) {
                let typeValid = false
                let extValid = false
                let fileEx = files[f].name.match(/\.\w{1,}$/)[0]
                let fileType = files[f].type.substr(0, files[f].type.indexOf('/'))
                for (let t = 0; t < types.length; t++) {
                    if (types[t].indexOf(fileType) > -1) {
                        if (types[t].indexOf('/*') > -1) {
                            typeValid = true
                            break
                        }
                        else if (types[t].indexOf(files[f].type) > -1) {
                            typeValid = true
                            break
                        }
                    }
                }
                if (!typeValid) {
                    if (extensions.indexOf(fileEx) > -1) {
                        extValid = true
                    }
                }
                if (!typeValid && !extValid) {
                    invalidFiles.push(f)
                }
            }
            if (invalidFiles.length > 0) {
                return {
                    invalidFiles: invalidFiles,
                    type: 'accept'
                }
            }
        },
        message: "File(s) extension is not accepted."
    },
    maxfile: {
        rule(val, validateValue) {
            if (val.length > parseInt(validateValue)) {
                return {
                    type: 'maxfile',
                    value: {
                        n: validateValue
                    }
                }
            }
        },
        message: "Please select not more than {n} files."
    },
    maxsize: {
        rule(val, validateValue) {
            let invalidFiles = []
            for (let v = 0; v < val.length; v++) {
                if (val[v].size > parseInt(validateValue)) {
                    invalidFiles.push(v)
                }
            }
            if (invalidFiles.length > 0) {
                const maxMB = parseInt(validateValue) / 1024 / 1024
                return {
                    isValid: false,
                    invalidFiles: invalidFiles,
                    type: 'maxsize',
                    value: {
                        n: maxMB.toString()
                    }
                }
            }
        },
        message: "File(s) must less than {n}Mb."
    }
}

export default validations