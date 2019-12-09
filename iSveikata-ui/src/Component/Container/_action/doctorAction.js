import {store} from '../_store/store'
import axios from 'axios'

export const doctorViewPatient = (patientId) =>{
    return{
        type:'DOCTOR_VIEW_PATIENT', payload:patientId
    }
}

export const doctorApiList = () =>{
    store.dispatch((dispatch) => {
        axios.get('http://localhost:8080/api/api')
        .then((response)=> {
            dispatch({ type:'FETCH_API_LIST', payload:response.data})
        })
        .catch((erorr) =>{
        })     
    })
}

export const doctorIcdList = () =>{
    store.dispatch((dispatch) => {
        axios.get('http://localhost:8080/api/icd')
        .then((response)=> {
            dispatch({ type:'FETCH_ICD_LIST', payload:response.data})
        })
        .catch((erorr) =>{
        })     
    })
}
    

