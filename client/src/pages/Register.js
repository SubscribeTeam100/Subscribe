import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "../components/common";
import { Marginer } from "../pages/Marginer";
import { AccountContext } from "../components/AccountContext";
import { Form } from "semantic-ui-react";
import {useForm} from '../util/submitbutton'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {withRouter} from 'react-router-dom'
import {AuthContext } from '../context/auth'



function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  const [errors, setErrors] = useState({});

  const {onChange, onSubmit, values} = useForm(registerCallBack,{
    username: '', password: '',email: '',confirmPassword:'', phone:''
  })

  const onClick = (event) =>{
    event.preventDefault();
  }
  const registerContext = useContext(AuthContext)
  const [ registerUser ,{loading}] = useMutation(REGISTER_USER,{
    update(_,result){
      props.history.push('/')
      registerContext.login(result.data.register)
    },onError(err){
      console.log(err)
      
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    }, 
    variables:values

  })

  function registerCallBack(){
    registerUser();
    console.log('registerCallback')
  }
  
  return (
    <div>
      <Form onSubmit= {onSubmit} noValidate className = {loading? 'loading': ''}>
      <BoxContainer>
      <FormContainer>
        <Input type="text" name = 'username' label = 'Username *' placeholder="UserName" onChange={onChange} value={values.username}/>
        <Input type="text" name = 'phone' label ='Phone' placeholder="Phone [Optional]" onChange={onChange} value={values.phone}/>
        <Input type="text" name= 'email' label = 'Email *' placeholder="Email" onChange={onChange} value={values.email}/>
        <Input type="password" name = 'password' label = 'Password *' placeholder="Password" onChange={onChange} value={values.password}/>
        <Input type="password" name = 'confirmPassword' label = 'Confirm Password *'placeholder="Confirm Password" onChange={onChange} value={values.confirmPassword}/>
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit">Signup</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#" onClick={switchToSignin}>
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
    </BoxContainer>
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
  );
}

const REGISTER_USER = gql`
  mutation register($username: String!, $password:String!, $confirmPassword: String!, $phone:String, $email:String!){
    register(registerInput:{username: $username, password:$password, confirmPassword:$confirmPassword, phone:$phone, email:$email}){
      id,
      token,
      isSeller,
      username
    }
  }

`;

export default withRouter(SignupForm);