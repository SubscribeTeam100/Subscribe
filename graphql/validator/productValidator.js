

module.exports = {
    productInputValidator(name, description, price){
        const errors ={}
        if(name === '' || description === ''|| price === '' ){
            
            errors.general = 'Required Fields cannot be empty'
        }
        return{
            errors,
            valid: Object.keys(errors).length < 1
        }
        
    }


}
