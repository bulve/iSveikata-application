import React from 'react'


var PatientInfoCard = (props) =>{
    return (
        <div className="panel-group">
            <div className="panel panel-default">
            <div className="panel-heading">
            <h3>{props.slogan}</h3>
            <h4>Pacientas: {props.patientFullName}</h4>
            <p>Gimimo data: {props.date}</p>
            <p>Asmens kodas: {props.patientId}</p>
            </div>
                <div className="panel-body">
                
                    <div>
                        {props.form}
                    </div>
                </div>
            </div>
        </div>
   
    )
}

export default PatientInfoCard;