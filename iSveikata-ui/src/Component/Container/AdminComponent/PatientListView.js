import React from 'react'


const PatientListView = (props) =>{


    return (
    <div> 
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Asmens kodas</th>
                    <th>Gimimo data</th>
                    <th>Vardas, pavardė</th>
                </tr>
            </thead>
            <tbody>
                {props.patients}
            </tbody>
        </table>
</div>)
}

export default PatientListView;