

export const UnauthorizedComponent = (userName, patientId) =>{
   
        sessionStorage.setItem("401", 
            JSON.stringify({
                info:"Prisijungimo sesija pasibaigė, prisijunkite iš naujo.",
                userName:userName,
                patientId:patientId
            }))
        
   
} 