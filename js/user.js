class FieldValidator{

/**
 * 构造器
 * @param {String} txtId 
 * @param {Function} validatorFunc 
 */
    constructor(txtId, validatorFunc){
        this.input = $('#' + txtId)
        this.p = this.input.nextElementSibling
        this.validatorFunc = validatorFunc
        this.input.onblur = () => {
            this.validate()
        }
    }

   async validate() {
        const err = await this.validatorFunc(this.input.value)
        if(err){
            this.p.innerText = err
            return false
        }else{
            this.p.innerText = ''
            return true
        }
    }



    static async validate(...validators){
        const proms = validators.map((it) => it.validate())
        const results = await Promise.all(proms);
        return results.every((r) => r )
    }
}

