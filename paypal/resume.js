const { get } = require('http');
var paypal = require('paypal-rest-sdk');
require('./paypalconfig.js');
var util = require('util')
var GET = require("./get.js")
async function Resume(billingAgreementId){
    let get = await GET(billingAgreementId).then(data=>{
       
        return data
    })
    if(get.state === 'Active'){
        let response = 'Subscription is already active in PayPal'
        return response;
    }
    
    
    if(reactivate_note ==='' || reactivate_note === null|| reactivate_note === undefined){
        var reactivate_note = {
            "note": "Reactivating the agreement"
        };
    }
    const reactivateAgreement = util.promisify(paypal.billingAgreement.reactivate)
    try{
        let response = await reactivateAgreement(billingAgreementId, reactivate_note);
        
        return response
    }catch(err){
        console.log('error in reactivateAgreement')
        throw err
    }
}
// Resume('I-BE8VLR6BYPER')
module.exports = Resume