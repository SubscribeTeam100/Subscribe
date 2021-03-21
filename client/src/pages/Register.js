import React,{useState} from 'react'
import {Button, Form, Container} from 'semantic-ui-react';
import gql from "graphql-tag"
import {useMutation} from "@apollo/react-hooks"
function Register(props){
  const[errors, setErrors] = useState({

  })
  const [values, setValues] = useState({
    username: '',
    email:'',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const onChange = (event) => {
    setValues({...values,[event.target.name]:event.target.value})
  }

  const [addUser, {loading}] = useMutation(REGISTER_USER,{
    update(proxy, result){
      props.history.push('/')
    },
    onError(err){
      console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  const onSubmit = (event)=>{
    event.preventDefault();
    
      addUser();
    
  }  

  
  return (

    <div>
      
          <h3 className="center-register-text">BANNER HERE<br/> We are very glad to have you here</h3><hr/>
      <div className = 'form-container'>
      <h1> Register</h1>
        <Form onSubmit = {onSubmit} noValidate className = {loading? 'loading' : ''}>
           
        <Form.Input 
        label='Username' 
        placeholder='username' 
        name = 'username'
        value = {values.username}
        onChange = {onChange}/>
         
        <Form.Input 
        label='Email' 
        placeholder='email' 
        name = 'email'
        value = {values.email}
        onChange = {onChange}/> 
        
        <Form.Input 
        label='Password' 
        placeholder='Password' 
        name = 'password'
        type = 'password'
        value = {values.password}
        onChange = {onChange}/> 
        
        <Form.Input 
        label='Confirm Password' 
        placeholder='Confirm Password' 
        name = 'confirmPassword'
        type = 'password'
        value = {values.confirmPassword}
        onChange = {onChange}/> 
        
        <Form.Input 
        label='Phone' 
        placeholder='Phone' 
        name = 'phone'
        value = {values.phone}
        onChange = {onChange}/>
        <Button type = 'submit' primary>Register</Button>
        </Form>
        {Object.keys(errors).length >0 && (
          <div className = 'ui error message'>
          <ul className = 'list'>
            {Object.values(errors).map(value =>(
              <li key = {value}>{value}</li>
            ))}
          </ul>
        </div>
       
        )}
      </div>
    </div>
      )
}


const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $phone: String!
  ){
    register(registerInput:{username: $username, email: $email, password: $password, confirmPassword: $confirmPassword, phone:$phone})
    {
      id
      email
      username
      createdAt
      token
    }
  }

`;
export default Register;