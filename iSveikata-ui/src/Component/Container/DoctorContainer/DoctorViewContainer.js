import React, {Component} from 'react';
import {connect} from 'react-redux';

import patient_records from '../../images/patient_records.png';
import stats from '../../images/stats.png';
import password_change from '../../images/password_change.png';
import logo from '../../images/logo.png';
import lr_logo from '../../images/lr_logo.png';

import '../../../Frontpage.css';

class DoctorViewContainer extends Component{
    constructor(props){
        super(props)
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.state = {
        }
    }

    //before mount check state of session exist and session user state (loggetIn, userType)
    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'doctor'){
            this.props.router.push('/vartotojams');
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
                                <a href="#gydytojas/pacientai" id="doctorViewPatient" className="thumbnail ">
                                <img  src={patient_records} alt="" id="patientRecords"/>
                                <h4 className="text-center">Peržiūrėti pacientų duomenis</h4>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#gydytojas/statistika" id="doctorViewStatistic" className="thumbnail ">
                                <img  src={stats} alt="" id="stats"/>
                                <h4 className="text-center">Peržiūrėti darbo dienų statistiką</h4>
                                </a>
                            </div>
                            <div className="col-md-4">
                                <a href="#gydytojas/slaptazodis" id="doctorChangePassword" className="thumbnail ">
                                <img  src={password_change} alt="" id="passwordChange"/>
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

export default connect(mapStateToProps)(DoctorViewContainer)