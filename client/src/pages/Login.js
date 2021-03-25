import React, { useContext } from "react";
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
import {useForm} from '../../util/submitbutton'
import gql from 'graphql-tag'
import {Form} from 'semantic-ui-react'


export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  });
const [LoginUser , {loading}] =useMutation(LOGINUSER, {
  update(_, result){
    props.history.push('/')
    console.log(result)
  },
  onError(err){(err.graphQLErrors[0].extensions.exception.errors)},
  variable : values
})

function loginUserCallback(){
  LoginUser()
}
  return (
    <div>
      <Form onSubmit= {onSubmit}>
      <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit">Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Don't have an accoun?{" "}
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

  mutation: LoginUser{email : $email, password : $password}
{
  login (email : $email, password : $password){
    id,
    username,
    isSeller,

  }
}


`