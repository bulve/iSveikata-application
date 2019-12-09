import React from 'react'



const PrescriptionUsageListingItem = (props) =>{
    return (
    <tr  >
            <td>{props.date}</td>
            <td>{props.druggistName}</td>
    </tr>)
}

export default PrescriptionUsageListingItem;