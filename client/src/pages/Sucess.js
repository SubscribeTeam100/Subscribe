import React, { useState } from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import { Container, Loader } from 'semantic-ui-react'

 export default function Success(){
    let location = window.location.href
    const [attemptActivation, setattemptActivation] = useState(false)
    const [activated, setActivated] = useState(false)
    const [billingID, setBillingID] = useState('')
    console.log('http://localhost:3000/success?subID=60848e61fb122f2ec047a90e&token=EC-8VH006374W212274G&ba_token=BA-38S24278HH706105F')
    let subID_position = location.indexOf('subID=')
    let token_position = location.indexOf('&token=')
    let token_end_position = location.indexOf("&ba_token=")
    let subID = location.slice(subID_position+6, token_position)

    let token = location.slice(token_position+7, token_end_position)
    const [activateSub, loading ] = useMutation(ACTIVATESUB,{
        update(_,result){
            
            setBillingID(result.data.activateSubscription.slice(result.data.activateSubscription.indexOf('Agreement')+16))
            setActivated(true)
            console.log('success')
        },
        onError(err){
            setActivated(false)
            console.log('error')
            console.log(err)
        }, variables:{
            paymentToken :token,
            subscriptionID : subID
        }
    })
    if(!attemptActivation){
        activateSub()
        setattemptActivation(true)
    }
    if(loading && !activated){
        return(
            <div>
                <Container>
                    <div><h3>HangOn tight, we're processing your order!</h3></div>
                    <div><Loader active/></div>
                </Container>
            </div>
        )
    }
   if(!activated){
       return(
           <div>
               <h1> Error! Something went wrong. Please verify that the subscription is active in your dashboard </h1>
           </div>
       )
   }
   return(
       <div>
           <Container text padding-top= '10px'>
           <h1>Congratulation! your order is in</h1>
           <h3>SubscriptionID : {subID} </h3>
           <h3>Paypal Billing Id : {billingID}</h3>
           <img src = 'https://topfivemusic.files.wordpress.com/2015/01/happy-excited-dogs-compilation.jpg'/>
           </Container>

       </div>
   )


}


const ACTIVATESUB = gql`
    mutation activateSubscription($paymentToken:String!,  $subscriptionID: ID!){
        activateSubscription(paymentToken : $paymentToken, subscriptionID: $subscriptionID)
    }

`