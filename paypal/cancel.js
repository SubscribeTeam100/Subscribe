

const { defaultFieldResolver } = require('graphql');
var paypal = require('paypal-rest-sdk');
require('./paypalconfig.js');
var GET = require('./get')
var util = require('util')
async function Cancel(billingAgreementId, cancel_note){
   

   if(cancel_note ==='' || cancel_note === null|| cancel_note === undefined){
    var cancel_note = {
        "note": "Canceling the agreement"
    };
   }
   let cancelAgreement = util.promisify(paypal.billingAgreement.cancel)
   try{
      response = await cancelAgreement(billingAgreementId, cancel_note)
      
      return response      
   } catch(err){
       console.log('error caught in cancelAgreement')
       console.log(JSON.stringify(err))
   }

}
// Cancel('I-0MSHH1FDRSVX')
module.exports = Cancel