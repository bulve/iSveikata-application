import React from 'react'


const PrescriptionUsageListView = (props) =>{


    return (
    <div> 
        <table  className="table table-hover">
            <thead>
                <tr>
                    <th>Recepto panaudojimo data</th>
                    <th>Vaistininkas</th>
                </tr>
            </thead>
            <tbody id="recorTableBody">
                {props.usage}
            </tbody>
        </table>
        {props.notFound}
</div>)
}

export default PrescriptionUsageListView;