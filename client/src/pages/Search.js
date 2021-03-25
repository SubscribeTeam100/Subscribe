// import React from 'react'


// function Search(){
//     const[errors, setErrors] = useState({

//     })
//     const [values, setValues] = useState({
      
//       email:'',
      
//       password: '',
      
//     })
//     const onChange = (event) => {
//       setValues({...values,[event.target.name]:event.target.value})
//     }
  
//     const [loginUser, {loading}] = useMutation(LOGIN_USER,{
//       update(proxy, result){
//         props.history.push('')
//       },
//       onError(err){
        
//         setErrors(err.graphQLErrors[0].extensions.exception.errors)
      
//       },
//       variables: values
//     })
  
//     const onSubmit = (event)=>{
//       event.preventDefault();
      
//       searchProducts();
      
//     }  


//     return (
//        <div>
//             <Form onSubmit={onSubmit} >
            
//             </Form>
//        </div>
//     )
// }

// export default Search;