import React from 'react'
import {Link} from 'react-router'

export const DoctorBindLink = (props) =>{
    return (<Link id={props.index} to={'/administratorius/vartotoju-apjungimas/'+props.userName} className='btn btn-default'>Priskirti gydytojui pacientą</Link>)
}