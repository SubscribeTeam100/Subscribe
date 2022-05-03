import React, { useState } from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import { PossibleFragmentSpreadsRule } from 'graphql';
import { Container, Form } from 'semantic-ui-react';
function GiveASuggestion_Seller(props){
    const [title,setTitle] = useState('')
    const [content, setContent]= useState('')
    const [postSub,{loading}] = useMutation(POST_SUGGESTION,{
        update(_,result){
            alert("Thank you for your Suggestion!");
            props.history.push('../')
        }, onError(err){
            alert(err)
        }, variables:{
            title,
            content
        }
    })
    

    return(
        <Container>
            <Form>
                <Form.Input name = 'title' label = 'Title' placeholder = 'Title' onChange = {(event)=>{setTitle(event.target.value)}}></Form.Input>
                <Form.Input name = 'content' label = 'Content' placeholder = 'Content' onChange = {(event)=>{setContent(event.target.value)}}></Form.Input>
                <Form.Button onClick = {()=>{postSub()}}>Submit</Form.Button>
            </Form>
        </Container>
    )
}
const POST_SUGGESTION = gql`
    mutation newSuggestion_Seller($title:String!, $content:String!){
        newSuggestion_Seller(title:$title, content:$content)
    }
`

export default GiveASuggestion_Seller