

export default function patient( state={ 
    loggedIn:false,
    patientId:'',
    fullName:''
}, action){
      switch (action.type){
          case "PATIENT_LOGGED_IN":{
              return {...state, loggedIn:true, patientId:action.payload, fullName:action.fullName}
          }
          case "PATIENT_LOGGED_OUT":{
              return {...state, loggedIn:false, patientId:'', fullName:''}
          }
          default:{
              return state
          }
          
      }
  }