import React from 'react'

const checkDate = (expirationDate) => {
    
    var style;
    return(
    new Date() > new Date (expirationDate) ? style={backgroundColor:'#EEE', color:'#BBB'}: style={color:'black'}
    )
}


const PrescriptionListingItem = (props) =>{

    return (
    <tr id={props.index} style={checkDate(props.expirationDate)} onClick={() =>  props.showDetails(props.id)}>
            <td >{props.prescriptionDate}</td>
            <td>{props.expirationDate}</td>
            <td>{props.ingredientName}</td>
            <td>{props.useAmount}</td>
            {props.viewUsageLink}
            
    </tr>
    )
}

export default PrescriptionListingItem;