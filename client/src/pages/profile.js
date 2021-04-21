import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Loader, Card,Segment, Grid, Input, Icon, Button } from "semantic-ui-react";
import moment from 'moment';

export default function ProfilePage(props){
    const {user} = useContext(AuthContext);
    const {data: userAddressesdata, loading: getUserAddresses_loading} = useQuery(GET_ADDRESSES);
    const [deleteAddress, {loading:deleteAddress_loading}] = useMutation(DELETE_ADDRESS,{
        update(_,result){
            window.location.reload(true);

        },
        onError(err){
           
           alert(err.graphQLErrors[0].message) 
            
        }
    })
    if(!user){
        return (<h1>Please <a href = '../login'>Login</a></h1>)
    }
    if(getUserAddresses_loading){
        return(<Loader active />)
    }
    


    

    return(
        <div>
            
        <hr/><hr/>
            <div className = 'address-container'>
                <span><h2> User Addresses: </h2> <button onClick = {()=>{props.history.push('./addAddress')}}><Icon name = 'plus'></Icon> Add Address</button></span>
                {userAddressesdata.getUserAddresses.length > 0? userAddressesdata.getUserAddresses.map(address =>(
                    <div>
                        <Card>
                        <p>{address.name}</p>
                        <p>{address.Address1}</p>
                        <p>{address.Address2? address.Address2 : ''}</p>
                        <p>{address.city}</p>
                        <p>{address.zip}</p>
                        <p>{address.country}</p>
                        <p>{address.email}</p>
                        <p>{address.phone}</p>

                        <Button color = 'red'  onClick = {()=>deleteAddress({variables:{addressId: address.id}})}> Delete Address </Button>
                        </Card>
                        <hr/>
                    </div>
                )) : (
                    <div>
                        Where should we deliver? <a href = './addAddress'><u>Add Address</u></a>
                    </div>
                )}
                
            </div> 
        </div>
    )
}




const GET_ADDRESSES= gql`
    query getUserAddresses{
        getUserAddresses{
            id
    
            createdAt
            name
            
            Address1
            Address2
            city
            
            state
            country
            zip
            phone
            email
        }
    }
`

const DELETE_ADDRESS = gql`
    mutation deleteAddress($addressId: ID!){
        deleteAddress(addressId: $addressId)
    }
`

