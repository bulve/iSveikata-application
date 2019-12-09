import {Component} from 'react';
import axios from 'axios';

import {connect} from 'react-redux';
import { userLoggedOut, patientLoggedOut } from './_action/index';

class LogoutContainer extends Component{
    

    componentWillMount = () =>{
        let logoutInfo = JSON.parse(sessionStorage.getItem("401"))
        let session =  JSON.parse(sessionStorage.getItem('session'))
        if(logoutInfo === null) {
            sessionStorage.setItem("401", 
            JSON.stringify({
                userName:session.user.userName,
                patientId:session.patient.patientId,
                info:"Sėkmingai atsijungėte."
            }))
        }
        this.logout()
        if(logoutInfo !== null){
            if(logoutInfo.userName === "" && logoutInfo.patientId === ""){
                this.props.router.push('/');
            }else if(logoutInfo.patientId === ""){
                this.props.router.push('/vartotojams');
            }else if(logoutInfo.userName === ""){
                this.props.router.push('/pacientams');
            }
        }else{
            if(session.user.userName === ""){
                this.props.router.push('/pacientams');
            }else if(session.patient.patientId === ""){
                this.props.router.push('/vartotojams');
            }else{
                this.props.router.push('/');
            }
        }
        this.props.dispatch(userLoggedOut())
        this.props.dispatch(patientLoggedOut())
        sessionStorage.setItem('doctor', null)
        sessionStorage.setItem('patientInfo', null)
        
    }
    
    logout = () =>{
        axios.post("http://localhost:8080/logout")
   }

    render(){
        return '';
    }
}


const mapStateToProps = (state) =>{
    return{
        user:state.user,
        patient:state.patient
        
    }
}
export default connect(mapStateToProps)(LogoutContainer)