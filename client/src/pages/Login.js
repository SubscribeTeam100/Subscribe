import React,{useState} from 'react'
import {Button, Form} from 'semantic-ui-react';
import gql from "graphql-tag"
import {useMutation} from "@apollo/react-hooks"
function Login(props){
  const[errors, setErrors] = useState({

  })
  const [values, setValues] = useState({
    
    email:'',
    
    password: '',
    
  })
  const onChange = (event) => {
    setValues({...values,[event.target.name]:event.target.value})
  }

  const [loginUser, {loading}] = useMutation(LOGIN_USER,{
    update(proxy, result){
      props.history.push('/')
    },
    onError(err){
      
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    
    },
    variables: values
  })

  const onSubmit = (event)=>{
    event.preventDefault();
    
    loginUser();
    
  }  

  
  return (

    <div>
      
          <h3 className="center-register-text">BANNER HERE<br/> We are very glad to have you here</h3><hr/>
      <div className = 'form-container'>
      <h1> Login</h1>
        <Form onSubmit = {onSubmit} noValidate className = {loading? 'loading' : ''}>
           
        
         
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
        
        
        
        <Button type = 'submit' primary>Login</Button>
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


const LOGIN_USER = gql`
  mutation login(
    
    $email: String!
    $password: String!
    
  ){
    login(email: $email, password: $password)
    {
      id
      
      token
    }
  }

`;
export default Login;