var paypal = require('paypal-rest-sdk')
require('./paypalconfig.js')
var util = require("util")
async function GET(BillingAgreementID){
    let getAgreement = util.promisify(paypal.billingAgreement.get)
    try{
        let billingAgreement =await getAgreement(BillingAgreementID)
        // console.log(billingAgreement)
        return billingAgreement
    }catch(err){
        console.log('error in getAgreement')
        console.log(err)
    }
    // paypal.billingAgreement.get(BillingAgreementID,function(error,billingAgreement){
    //     if(error){
    //         console.log(error)
    //         throw error
    //     }else{
    //         jsonbillingAgreement = JSON.stringify(billingAgreement)
    //         console.log(jsonbillingAgreement)
    //         return jsonbillingAgreement
    //     }
    // })
}
// GET('I-JCA51F5MGH8M')
module.exports = GET
