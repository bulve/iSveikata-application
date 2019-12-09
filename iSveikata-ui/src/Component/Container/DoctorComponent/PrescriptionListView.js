import React from 'react'

const PrescriptionListView = (props) =>{


    return (
    <div> 
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Išrašymo data</th>
                    <th>Galiojimo data</th>
                    <th>Vaisto veiklioji medžiaga</th>
                    {props.useAmountColumnName}
                </tr>
            </thead>
            <tbody>
       
                {props.prescription}
                
            </tbody>
        </table>
        {props.notFound}
</div>)
}

export default PrescriptionListView;