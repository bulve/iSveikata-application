import React from 'react'



const RecordDetailsListingItem = (props) =>{
    var yesValue = 'Taip';
    var noValue = 'Ne';

    var compensable = props.compensable === true? yesValue:noValue;
    var repetitive = props.repetitive === true? yesValue:noValue;

    return (
    <tr>    
             <td><div>{props.appDescription.substring(0, 30)}...</div></td>
             <td>{props.appDuration} min</td>
             <td>{compensable}</td>
             <td>{repetitive}</td>
    </tr>)
}

export default RecordDetailsListingItem;