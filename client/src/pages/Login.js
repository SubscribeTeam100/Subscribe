import React, { useState,useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "../components/common";
import { Marginer } from "./Marginer";
import { AccountContext } from "../components/AccountContext";
import {useForm} from '../util/submitbutton'
import gql from 'graphql-tag'
import {Form} from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import {withRouter} from 'react-router-dom';
import {AuthContext } from '../context/auth'

function LoginForm(props) {
  
  const { switchToSignup } = useContext(AccountContext);
  const [errors, setErrors] = useState({});
  const loginContext = useContext(AuthContext)
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: '',
    password: ''
  })
  const [LoginUser, { loading }] = useMutation(LOGINUSER, {
    update(
      proxy, result
    ) {
      loginContext.login(result.data.login)
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

function loginUserCallback(){
  LoginUser()
}
  return (
    <div>
      <Form onSubmit= {onSubmit} noValidate className= {loading? 'loading' : ''}>
      <BoxContainer>
      <FormContainer>
        <Input type="text" name = "email" placeholder="Email"  value= {values.email} onChange = {onChange}/>
        <Input type="password" name = "password" placeholder="Password" value= {values.password} onChange = {onChange}/>
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit">Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#" onClick={switchToSignup}>
        Don't have an account?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
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
  </div>)
}


const LOGINUSER = gql`

  mutation login($email : String!, $password : String!)
{
  login (email : $email, password : $password){
    
    username,
    isSeller,
    token

  }
}


`;

export default withRouter(LoginForm);