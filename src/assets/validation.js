const rules = {
    required(val, validateValue) {
        if (Array.isArray(val) || typeof val == 'string' || typeof val == 'object') {
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
        return {}
    },
    validnumber(val) {
        if (!/^[0-9]*$/.test(val)) {
            return {
                type: 'validnumber',
            }
        }
        return {}
    },
    minlength(val, validateValue) {
        if (val.length < parseInt(validateValue)) {
            return {
                type: 'minlength',
                value: {
                    n: validateValue
                }
            }
        }
        return {}
    },
    maxlength(val, validateValue) {
        if (val.length > parseInt(validateValue)) {
            return {
                type: 'maxlength',
                value: {
                    n: validateValue
                }
            }
        }
        return {}
    },
    equalto(val, validateValue) {
        if (val != validateValue) {
            return {
                type: 'equalto',
            }
        }
        return {}
    },
    validemail(val, validateValue) {
        const mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        if (!val.match(mailFormat)) {
            return {
                type: 'validemail'
            }
        }
        return {}
    },
    min(val, validateValue) {
        if (val < parseFloat(validateValue)) {
            return {
                type: 'min',
                value: {
                    n: validateValue
                }
            }
        }
        return {}
    },
    max(val, validateValue) {
        if (val > parseFloat(validateValue)) {
            return {
                type: 'max',
                value: {
                    n: validateValue
                }
            }
        }
        return {}
    },
    accept(val, validateValue) {
        const acceptList = validateValue.trim().split(',')
        let types = []
        let extensions = []
        acceptList.forEach((a, i) => {
            if (a.indexOf('/') > -1) {
                types.push(a)
            }
            else if (a.match(/\.\w{1,}$/)) {
                extensions.push(a.match(/\.\w{1,}$/)[0])
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
                isValid: false,
                invalidFiles: invalidFiles,
                type: 'accept'
            }
        }

        return {}
    },
    maxfile(val, validateValue) {
        if (val.length > parseInt(validateValue)) {
            return {
                isValid: false,
                type: 'maxfile',
                value: {
                    n: validateValue
                }
            }
        }

        return {}
    },
    maxsize(val, validateValue) {
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

        return {}
    }
}

export default rules