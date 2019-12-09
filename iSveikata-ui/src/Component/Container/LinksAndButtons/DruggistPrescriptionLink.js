import React from 'react'
import {Link} from 'react-router'

export const DruggistPrescriptionLink = (props) =>{
    return(<Link to={'/vaistininkas/klientas/'+props.patientId+'/receptai'} className='btn btn-default'>Peržiūrėti receptus</Link>)
}

