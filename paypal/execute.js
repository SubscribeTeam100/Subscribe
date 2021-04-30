
var paypal = require('paypal-rest-sdk')
require('./paypalconfig.js')
var util = require('util')
async function Execute(paymentToken){
    //todo:: get the agreement and see if it is paid
    
    let executeAgreement = util.promisify(paypal.billingAgreement.execute)
    try{
        let billingAgreement = await executeAgreement(paymentToken, {})
       console.log(billingAgreement)
        return billingAgreement;

    }catch(err){
        console.log('error in executing billingAgreement')
        console.log(err)
        throw err   
    }
    // paypal.billingAgreement.execute(paymentToken,{},function(error,billingAgreement){
    //     if(error){
    //         console.log(error)
    //         throw error
    //     }else{
    //         jsonagreement = JSON.stringify(billingAgreement)
    //        console.log(jsonagreement)
    //         return jsonagreement
            
    //     }
    // })
}

module.exports = Execute;
// Execute('EC-66V00866BL8149645')