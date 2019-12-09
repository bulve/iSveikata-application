

export const patientLoggedIn = (patientId, fullName) =>{
    return{
        type:'PATIENT_LOGGED_IN', payload:patientId, fullName:fullName
    }
}

export const patientLoggedOut = () =>{
    return{
        type:'PATIENT_LOGGED_OUT'
    }
}