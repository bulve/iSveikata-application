import React from 'react'


const DoctorListingItem = (props) =>{
    return (
    <tr >
            <td>{props.fullName}</td>
            <td>{props.userName}</td>
            <td>{props.specialization}</td>
            <td>{props.doctorBindLink}</td>

    </tr>)
}

export default DoctorListingItem;