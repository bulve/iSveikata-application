import React, {Component} from 'react';
import {connect} from 'react-redux';

import patient_records from '../../images/patient_records.png';
import stats from '../../images/stats.png';
import password_change from '../../images/password_change.png';
import logo from '../../images/logo.png';
import lr_logo from '../../images/lr_logo.png';

import '../../../Frontpage.css';

class PatientViewContainer extends Component{
    constructor(props){
        super(props)
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.state = {
        }
    }

    //before mount check state of session exist and session user state (loggetIn, userType)
    componentWillMount = () =>{
        if(this.session === null || this.session.patient.loggedIn !== true){
            this.props.router.push('/pacientams');
            return '';
        }
    }   
    

    render() {
        return (
            <div>
                <header className="text-black">
                    <div className="container">
                        <img  src={logo} alt="iSveikata" id="logo" className="img-responsive center-block"/>
                    </div>
                </header>
                    <div className="container">
                        <div className="row frontPagePanel">

                            <div className="col-md-4">
                                <a href="#pacientas/ligos-irasai" id="patientMedicalRecord" className="thumbnail ">
                                <h4 className="text-center">Peržiūrėti ligos įrašus</h4>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#pacientas/receptai" id="patientPrescription" className="thumbnail ">
                                <h4 className="text-center">Peržiūrėti išrašytus receptus</h4>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#pacientas/slaptazodis" id="patientChangePassword" className="thumbnail ">
                                <h4 className="text-center">Keisti slaptažodį</h4>
                                </a>
                            </div> 
                        </div>
                    </div>
            </div>
        )
    }
}


//map reduxe store state to container props
const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}

export default connect(mapStateToProps)(PatientViewContainer)