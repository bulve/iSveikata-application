import axios from 'axios'
import {store} from '../_store/store'

export const adminSpecializationList = () =>{
    store.dispatch((dispatch) => {
        axios.get('http://localhost:8080/api/specialization')
        .then((response)=> {
            dispatch({ type:'FETCH_SPECIALIZATION_LIST', payload:response.data})
        })
        .catch((erorr) =>{
        })     
    })
}