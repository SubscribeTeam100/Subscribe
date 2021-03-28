

import React, {useState} from "react"
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useForm} from '../../util/submitbutton'
import {Form, Button,  Select} from 'semantic-ui-react';


const AddAddressForm = ()=> {
    const [errors, setErrors] = useState({});
    const stateAbbreviations = [
        { text: 'Alabama', value: 'AL' },
        { text: 'Alaska', value: 'AK' },
        { text: 'American Samoa', value: 'AS' },
        { text: 'Arizona', value: 'AZ' },
        { text: 'Arkansas', value: 'AR' },
        { text: 'California', value: 'CA' },
        { text: 'Colorado', value: 'CO' },
        { text: 'Connecticut', value: 'CT' },
        { text: 'Delaware', value: 'DE' },
        { text: 'District of Columbia', value: 'DC' },
        { text: 'Florida', value: 'FL' },
        { text: 'Georgia', value: 'GA' },
        { text: 'Guam', value: 'GU' },
        { text: 'Hawaii', value: 'HI' },
        { text: 'Idaho', value: 'ID' },
        { text: 'Illinois', value: 'IL' },
        { text: 'Indiana', value: 'IN' },
        { text: 'Iowa', value: 'IA' },
        { text: 'Kansas', value: 'KS' },
        { text: 'Kentucky', value: 'KY' },
        { text: 'Louisiana', value: 'LA' },
        { text: 'Maine', value: 'ME' },
        { text: 'Maryland', value: 'MD' },
        { text: 'Massachusetts', value: 'MA' },
        { text: 'Michigan', value: 'MI' },
        { text: 'Minnesota', value: 'MN' },
        { text: 'Mississippi', value: 'MS' },
        { text: 'Missouri', value: 'MO' },
        { text: 'Montana', value: 'MT' },
        { text: 'Nebraska', value: 'NE' },
        { text: 'Nevada', value: 'NV' },
        { text: 'New Hampshire', value: 'NH' },
        { text: 'New Jersey', value: 'NJ' },
        { text: 'New Mexico', value: 'NM' },
        { text: 'New York', value: 'NY' },
        { text: 'North Carolina', value: 'NC' },
        { text: 'North Dakota', value: 'ND' },
        { text: 'Ohio', value: 'OH' },
        { text: 'Oklahoma', value: 'OK' },
        { text: 'Oregon', value: 'OR' },
        { text: 'Pennsylvania', value: 'PA' },
        { text: 'Puerto Rico', value: 'PR' },
        { text: 'Rhode Island', value: 'RI' },
        { text: 'South Carolina', value: 'SC' },
        { text: 'South Dakota', value: 'SD' },
        { text: 'Tennessee', value: 'TN' },
        { text: 'Texas', value: 'TX' },
        { text: 'Utah', value: 'UT' },
        { text: 'Vermont', value: 'VT' },
        { text: 'Virgin Islands', value: 'VI' },
        { text: 'Virginia', value: 'VA' },
        { text: 'Washington', value: 'WA' },
        { text: 'West Virginia', value: 'WV' },
        { text: 'Wisconsin', value: 'WI' },
        { text: 'Wyoming', value: 'WY' },
      ];

      

    const {onChange, onSubmit, values} = useForm(addAddressCallback, {
    name:'',
    Address1: '',
    Address2: '',
    city:'',
    country:'',
    zip:'',
    phone:'',
    email:''
    })
    const [state, setState] = useState('')
    const handleItemClick = (e, { name }) => setState(e.target.innerText)

    const [addAddress, {loading}] = useMutation(ADD_ADDRESS,{
        update(_,results){
            alert('Address Added')
        },
        onError(err){
             
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: {
            name : values.name,
            Address1 : values.Address1,
            Address2 : values.Address2,
            city : values.city,
            state : state,
            country : values.country,
            zip : values.zip,
            phone : values.phone,
            email : values.email
        }
    })

    function addAddressCallback(){
        addAddress()
    }
    return(
        <div className= 'form-container'>
            <Form noValidate onSubmit ={onSubmit} className = {loading? 'loading':''}>
            <Form.Input
                label='Name'
                name = 'name'
                placeholder = 'Name'
                value = {values.name}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Address 1'
                name = 'Address1'
                placeholder = 'Address 1'
                value = {values.Address1}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Address 2'
                name = 'Address2'
                placeholder = 'Address 2'
                value = {values.Address2}
                onChange = {onChange}
            />
            <Form.Input
                label='City'
                name = 'city'
                placeholder = 'City'
                value = {values.city}
                onChange = {onChange}
                required
            />
            <Form.Select
                label='State'
                name = 'state'
                options = {stateAbbreviations}
                onChange = {
                    handleItemClick
                }
                placeholder = 'state'
                required
            />
            
           
            <Form.Input
                label='ZipCode'
                name = 'zip'
                placeholder = 'Zip'
                value = {values.zip}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Country'
                name = 'country'
                placeholder = 'Country'
                value = {values.country}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Email'
                name = 'email'
                placeholder = 'Email'
                value = {values.email}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Phone'
                name = 'phone'
                placeholder = 'Phone'
                value = {values.phone}
                onChange = {onChange}
                required
            />            


            <Button type = 'submit' primary>Submit</Button>

            </Form>
            {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
        </div>



    )
};

const ADD_ADDRESS = gql`
    mutation addAddress($name:String!, $Address1:String!,$Address2: String,$city:String!,$state:String!,$country:String!,$zip:String!,$phone:String!,$email:String!) {
        addAddress(addressInput:{name: $name, Address1: $Address1, Address2: $Address2,city: $city,state: $state,country: $country,zip: $zip, phone:$phone, email:$email}){
            id,
            createdAt,
            addressID
           
        }
    }

`

export default AddAddressForm;