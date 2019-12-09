

export const userLoggedIn = (userType, userName, fullName) =>{
    return{
        type:'USER_LOGGED_IN', loggedIn:true, userType:userType, userName:userName, fullName:fullName
    }
}

export const userLoggedOut = () =>{
    return{
        type:'USER_LOGGED_OUT'
    }
}