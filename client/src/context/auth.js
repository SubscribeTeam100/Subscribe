import React, {useReducer, createContext} from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
    user : null
}

if(localStorage.getItem('jwtToken')){
    const token = jwtDecode(localStorage.getItem('jwtToken'))

    if(token.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    }else{
        initialState.user = token
    }
}


const AuthContext = createContext({
    user: null,
    login:(userdata) =>{},
    logout:(data) =>{}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }
        
        default:
            return state;

    }
}

function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initialState)

    function login(userdata){
        localStorage.setItem('jwtToken', userdata.token)
        
        dispatch({
            type:'LOGIN',
            payload : userdata
        })
    }

    function logout(userdata){
        localStorage.removeItem("jwttoken")
        dispatch({
            type : 'LOGOUT'
        })
    }

    return(
        <AuthContext.Provider value = {{user:state.user, login, logout}}
        {...props} />
    )
}

export {AuthContext, AuthProvider}