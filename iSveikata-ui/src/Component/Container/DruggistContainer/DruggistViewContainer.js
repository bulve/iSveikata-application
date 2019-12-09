import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import PatientListingItem from '../AdminComponent/PatientListingItem';
import PatientListView from '../AdminComponent/PatientListView';
import SearchFieldForm from '../DoctorComponent/SearchFieldForm';
import { DruggistPrescriptionLink } from '../LinksAndButtons/DruggistPrescriptionLink';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

class DruggistViewContainer extends Component{
    constructor(props){
        super(props)
        this.timeOut = ''
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.state = {
            patient:'',
            searchValue:'',  
        }
    }

    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'druggist'){
            this.props.router.push('/vartotojams');
            return '';
        }  
    }
   
    searchForPatientById = (patientId) =>{
        axios.get(' http://localhost:8080/api/patient/'+patientId)
        .then((response)=>{
            
            if(response.data.length === 0){
                this.setState({
                    patient:(<h3>Klientų su tokiu asmens kodu nėra.</h3>)
                })
            }else{
                this.setState({
                    patient: <PatientListView  patients={this.composePatient(response.data)} />,
                })
                sessionStorage.setItem("patientInfo", JSON.stringify(response.data))
            }
                  
            
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patient:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    composePatient = (patient) =>{
        
        return (
            <PatientListingItem
                patientId={patient.id}
                birthDate={patient.birthDate}
                fullName={patient.fullName}
                druggistPrescriptionView={<td><DruggistPrescriptionLink patientId={patient.id}/></td>}
                   
            />
        )
    }
   
    fielddHandler = (e) =>{
        this.setState({
            searchValue:e.target.value
        })
    }


    searchHandler = (e) =>{
        e.preventDefault()
        clearTimeout(this.timeOut)
        if(this.state.searchValue.length === 11){
           this.timeOut = setTimeout(() =>{
                this.searchForPatientById(this.state.searchValue)
            } , 500 )
        }else{
            this.setState({
                patient:(<h3>Įveskite taisyklingą asmens kodą.</h3>)
            })
        }
    }



    render() {
        return (
            <div className="container">
            <section>
            <UserDetailsComponent  fullName={this.session.user.fullName} other={
                    <li className="navbar-text">
                    <button onClick={() =>  this.props.router.goBack()} className="btn btn-default"> Atgal </button>
                    </li>
                }/>
                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4>Klientų paieška pagal asmens kodą</h4>
                        </div>
                        <div className="panel-body">
                            <div className="col-sm-12">
                            <h4 className="text-center">Įveskite kliento asmens kodą:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                            
                                <SearchFieldForm 
                                    searchType={"number"}
                                    searchHandler={this.searchHandler}
                                    fielddHandler={this.fielddHandler}
                                    searchValue={this.state.searchValue}
                                    searchPlaceHolder={"Kliento asmens kodas"}
                                />
                            </div>
                            
                            <div className="col-sm-12">
                               {this.state.patient}                            
                        
                            </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}

const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}

export default connect(mapStateToProps)(DruggistViewContainer)

