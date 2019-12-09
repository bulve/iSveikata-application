import React from 'react'
import {Link} from 'react-router'

export const NewPrescriptionLink = (props) =>{
    return(<Link id={"newPrescription" + props.index} onClick={props.clickHandler} to={'/gydytojas/naujas/receptas'} className='btn btn-default'>Naujas receptas</Link>)
}

