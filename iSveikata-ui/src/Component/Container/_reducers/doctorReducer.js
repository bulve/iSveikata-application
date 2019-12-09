

export default function doctor( state={
    patientId:'',
    apiList:null,
    icdList:null
   }, action){
   
      switch (action.type){
        case "DOCTOR_VIEW_PATIENT":{
            return {...state, patientId:action.payload}
        }
        case "FETCH_API_LIST":{
            return {...state, apiList:action.payload }
        }
        case "FETCH_ICD_LIST":{
        return {...state, icdList:action.payload }
        }
        default:{
            return state
        }
          
      }
  }