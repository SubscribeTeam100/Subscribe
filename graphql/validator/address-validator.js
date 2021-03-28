module.exports = {
    addressInputValidator(name, Address1, Address2, city, state, country, zip, phone, email){
        const errors ={}
        if(name === '' || Address1 === ''|| city === '' || state === ''||country === '' || zip === '' || phone === '' || email === ''){
            
            errors.general = 'Required Fields cannot be empty'
        }
        return{
            errors,
            valid: Object.keys(errors).length < 1
        }
        
    }


}
