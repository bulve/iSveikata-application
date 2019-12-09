import React from 'react'

const PatientListingItem = (props) =>{
    return (
    <tr >
            <td>{props.patientId}</td>
            <td>{props.birthDate}</td>
            <td>{props.fullName}</td>
            {props.doctorViewPatient}
            {props.recordLink}
            {props.prescriptionLink}
            {props.patientBindLink}
            {props.druggistPrescriptionView}

    </tr>)
}

export default PatientListingItem;