

var paypal= require('paypal-rest-sdk');

require('./paypalconfig')
var url = require('url')
const util = require('util');
const { update } = require('../models/Subscription');

async function Create(product, subscription, address){ 
   

    var isoDate = new Date();
    isoDate.setSeconds(isoDate.getSeconds() + 4);
    isoDate.toISOString().slice(0, 19) + 'Z';
    

var billingPlanAttributes = {
    "description" : "creating plan for subscription",
    "merchant_preferences" : {
        "auto_bill_amount": "yes",
        "cancel_url": "http://www.canceled.com",      //TODO: update cancel_url and return_url
        "initial_fail_amount_action": "continue",
        "max_fail_attempts": "1",
        "return_url": `http://localhost:3000/success?subID=${subscription.id}`,
        "setup_fee": {
            "currency": "USD",
            "value": "3"
        }
    },
    "name": "Subscription for " + subscription.id,
    "payment_definitions":[
        {
            "amount":{
                "currency": "USD",
                "value": (product.price * subscription.quantity).toFixed(2)
            },
            "charge_models":[
                {
                    "amount": {
                        "currency": "USD",
                        "value": "5.00"
                    },
                    "type": "SHIPPING"
                },
                {
                    "amount":{
                        "currency": "USD",
                        "value": (product.price*0.07).toFixed(2)

                    },
                    "type": "TAX"
                }

            ],
            "cycles":"0",               
            "frequency": subscription.frequency === 'BIWEEKLY'? 'WEEK' : subscription.frequency,
            "frequency_interval": subscription.frequency === 'BIWEEKLY'? 2 : 1,
            "name" : subscription.id,
            "type" :"REGULAR"
        }
    ],
    "type":"INFINITE"
}


var billingPlanUpdateAttributes=[
    {
        "op" : "replace",
        "path" :"/",
        "value":{
            "state":"ACTIVE"
        }
    }
]
var billingAgreementAttributes = {
    "name" :subscription.id+ " = Subscription for " + product.name,
    "description" : subscription.id + " Agreement for "+ product.name + ", quantity = " + subscription.quantity,
    "start_date": isoDate,
    "plan":{
        "id" : product.id
    },
    "payer":{
        "payment_method" : "paypal"
    },
    "shipping_address":{
        "line1": address.Address1,
        "line2": address.Address2,
        "city": address.city,
        "state": address.state,
        "postal_code": address.zip,
        "country_code": "US"            //TODO:: change this when it needs to be changed. 
    }
};

const CreatePlan = util.promisify(paypal.billingPlan.create)
const updatePlan = util.promisify(paypal.billingPlan.update) 
const createagreement = util.promisify(paypal.billingAgreement.create)
try{
    let billingPlan = await CreatePlan(billingPlanAttributes)
    
    
   try{ 
    let response = await updatePlan(billingPlan.id, billingPlanUpdateAttributes)
    console.log('Billing plan create response:::', billingPlan)
    console.log("response from updatePlan", response)
    console.log(billingAgreementAttributes)
        try{
            billingAgreementAttributes.plan.id = billingPlan.id;
            let billingAgreement = await createagreement(billingAgreementAttributes)
            // console.log("Create Billing Agreement Response");
            // console.log(billingAgreement);
            for (var index = 0; index < billingAgreement.links.length; index++) {
                if (billingAgreement.links[index].rel === 'approval_url') {
                    var approval_url = billingAgreement.links[index].href;
                    // console.log("For approving subscription via Paypal, first redirect user to");
                    // console.log(approval_url);

                    // console.log("Payment token is");
                    // console.log(url.parse(approval_url, true).query.token);
                    // See billing_agreements/execute.js to see example for executing agreement 
                    // after you have payment token
                    return approval_url
                }
            }
        }catch(err){
            console.log('error found in agreemtne')
            console.log(JSON.stringify(err))
            console.log('message is ')
            console.log(err.message)
        }

   }catch(err){
    console.log('error found in updatePlan')
    console.log(err)
   }

}catch(err){
    console.log('error found in createPlan')
    console.log(err)
}
}


module.exports = Create;