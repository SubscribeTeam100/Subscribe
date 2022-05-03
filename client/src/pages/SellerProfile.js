import React from 'react'
import { Link } from 'react-router-dom'
import { Segment, Card } from 'semantic-ui-react'

export default function SellerProfile(){
    return(
        <div>
            <Segment>
                <Card as={Link} to='/seller/payoutAccount'>
                    Payout Account
                </Card>
            </Segment>
        </div>
    )
}