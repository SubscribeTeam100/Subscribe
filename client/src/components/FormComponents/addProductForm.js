

import React, {useState,useContext} from "react"
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useForm} from '../../util/submitbutton'
import {Form, Button, TextArea, Radio} from 'semantic-ui-react';
import {AuthContext} from "../../context/auth"

const AddProductForm = ()=> {
    const [errors, setErrors] = useState({});
    const [text,settext] = useState({ImageURL:'', tag:''})

    const {onChange, onSubmit, values} = useForm(addProductCallback, {
        name:'',
        description: '',
        price: '',
        
    })
    const { user } = useContext(AuthContext);
    const [ImageLink, setImageLink ] = useState([])
    const [tags, settags] = useState([])
    const [isVisible, setisVisible] = useState(true)
    
    const [addProduct, {loading}] = useMutation(ADD_PRODUCT,{
        update(_,results){
            alert('success')
        },
        onError(err){
            
            alert('error') 
            
            throw("error is this: ", err)
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
            
        },
        variables: {
            name : values.name,
            description : values.description,
            price : values.price,
            isVisible,
           tags,
           ImageLink
        }
    })

    function ImageLinkArrayHandler(event,{name}) {
       
        setImageLink(ImageLink => ImageLink.concat(text.ImageURL))
        settext({...text, ImageURL : ''})
        
    }
    
    function tagArrayHandler(event,{name}) {
        settags(tags => tags.concat(text.tag))
        settext({...text, tag:''})
    }
 
    function HandleText(event,{name}){
        
        if(name === 'ImageLink'){
            settext({...text, [name]: event.target.value})
        }
        else{
            settext({...text, [name] : event.target.value})
        }
       
    }

    function handleVisibility(){
        isVisible?(
            setisVisible( false)
        
            )    :( 
            setisVisible( true)
            )
    }

    function addProductCallback(){
        addProduct()
    }
    if(!user.isSeller){
        return(
            <div>
                You must be a seller to view this page
            </div>
        )
    }
    return(
        <div className= 'form-container'>
            <Form  className = {loading? 'loading':''}>
            <Form.Input
                label='Name'
                name = 'name'
                placeholder = 'Name'
                value = {values.name}
                onChange = {onChange}
                required
            />
            <Form.Input
                label='Price'
                name = 'price'
                placeholder = 'Price'
                value = {values.price}
                onChange = {onChange}
                required
            />
            <Form.Field
            control = {TextArea}
                label='Description'
                name = 'description'
                placeholder = 'Description'
                value = {values.description}
                onChange = {onChange}
                required
            /><br/>
            <Form.Input
                label='Image URL'
                name = 'ImageURL'
                placeholder = 'Image URL'
                value = {text.ImageURL}
                onChange = {HandleText}
                
                
            />
                    <div>
                        {ImageLink.length > 0 && (
                    <div className="ui info message" style={{wordBreak:"break-word"}}>
                    <ul className="list">
                        {ImageLink.map((value) => (
                        <li key={value}>{value}</li>
                        ))}
                     </ul>
                     </div>
                    )}
                        
                    </div>
            <Button onClick = {ImageLinkArrayHandler}>Add Image</Button>
            <br/> <br/>
            
            <Form.Input
                label='Tags'
                name = 'tag'
                placeholder = 'Tags...'
                value = {text.tag}
                onChange = {HandleText}
                
            />
            <Button onClick = {tagArrayHandler}>Add Tag</Button>
            
                <div>
                    {tags.length > 0 && (
                     <div className="ui info message">
                        <ul className="list">
                        {tags.map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                        </ul>
                     </div>
                    )}
                </div>

            <br/>
            <span>
            <b></b> 
            <Radio toggle 
                defaultChecked
                onChange = {handleVisibility}
                label = {isVisible?'Public Listing':'Private Listing'}
            />
            </span>
            <hr/>
                            {console.log(isVisible )}

            <Button type = 'submit' primary onClick = {onSubmit}>Submit</Button>



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

const ADD_PRODUCT = gql`
  mutation addProduct(
    $name: String!
    $description: String!
    $price: String!
    $isVisible: Boolean!
    $tags: [String]
    $ImageLink: [String]
  ) {
    addProduct(
      productInput: {
        name: $name
        description: $description
        price: $price
        isVisible: $isVisible
        tags: $tags
        ImageLink: $ImageLink
      }
    ) {
      id
      createdAt
    }
  }
`;

export default AddProductForm;