var paypal = require('paypal-rest-sdk');
require('./paypalconfig.js');
var util = require('util')
var GET = require('./get.js')
async function Suspend(billingAgreementId){
    let get = await GET(billingAgreementId).then(data=>{
        return data
    })
    if(get.state !== 'Active'){
        let response = 'paypal agreement is not active to be suspended';
        return response;
    }
    
    
    if(suspend_note ==='' || suspend_note === null|| suspend_note === undefined){
        var suspend_note = {
        "note": "Suspending the agreement"
        };
    }
    
const suspendAgreement = util.promisify(paypal.billingAgreement.suspend)

try{
    let response = await suspendAgreement(billingAgreementId, suspend_note);
    
    return response
}catch(err){
    console.log('error in suspendAgreement')
    throw err
}}
// paypal.billingAgreement.suspend(billingAgreementId, suspend_note, function (error, response) {
//     if (error) {
//         console.log(error);
//         throw error;
//     } else {
//         console.log("Suspend Billing Agreement Response");
//         console.log(response);
//     }
// }
// }
module.exports = Suspend