
module.exports = {
    validateRegisterInput(username, email, password, confirmPassword, phone){
        const errors = {};
        if(username.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === ''){
            errors.general = 'Required Fields cannot be empty'
        }
        const regEx  = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Valid Email address is required'
        }
        if(password !== confirmPassword){
            errors.password = 'Passwords do not match'
        }
        const phoneregEx = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
        if(phone){
            if(!phone.match(phoneregEx)){
                errors.phone = 'Invalid Phone number'
            }
        }
        return{
            errors,
            valid: Object.keys(errors).length < 1
        }
        
    },

    validateLogin(email, password){
        const errors = {}
        if(email.trim() === '' || password.trim() === ''){
            errors.general = 'Required fields cannot be empty'
        }
        const regEx  = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Valid Email address is required'
        }
        return{
            errors,
            valid: Object.keys(errors).length <1
        }
    }


}