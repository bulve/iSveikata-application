import React from 'react'



const RecordListingItemDemo = (props) =>{

    return (
    <tr  id={props.index} onClick={() => props.showDetails(props.id)} >
            <td>{props.appDate}</td>
            <td>{props.doctorName}</td>
            <td>{props.icd}</td>
    </tr>)
}

export default RecordListingItemDemo;