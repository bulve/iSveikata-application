


export default function admin( state={
    specializationList:''
   }, action){
   
      switch (action.type){
          case "FETCH_SPECIALIZATION_LIST":{
              return {...state, specializationList:action.payload}
          }
          default:{
              return state
          }
          
      }
  }