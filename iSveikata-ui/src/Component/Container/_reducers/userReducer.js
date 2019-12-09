

export default function user( state={
    userType:'',
    userName:'',
    fullName:'',
    loggedIn:'false',
   }, action){
    // if(action.type === "INC"){
    //   return {...state, number:action.payload};
    // }else if(action.type === "DEC"){
    //   return {...state, number:action.payload}
    // }
      switch (action.type){
          case "USER_LOGGED_IN":{
              return {...state, loggedIn:action.loggedIn, userType:action.userType, userName:action.userName, fullName:action.fullName}
          }
          case "USER_LOGGED_OUT":{
              return {...state, loggedIn:false, userType:'', userName:'', fullName:''}
          }
          default:{
              return state
          }
          
      }
  }