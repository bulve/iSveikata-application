import React, {Component} from 'react';
import axios from 'axios';

import PatientListView from '../AdminComponent/PatientListView';
import PatientListingItem from '../AdminComponent/PatientListingItem';
import { PatientBindLink } from '../LinksAndButtons/PatientBindLink';
import SearchFieldForm from '../DoctorComponent/SearchFieldForm';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

export default class AdminBindUserPartContainer extends Component{
    constructor(){
        super();
        this.session =  JSON.parse(sessionStorage.getItem('session'))
        this.timeOut=''
        this.state = {
            patientList:'',
            infoState:'',
            
            listInfo:'',

            activePage:0,
            itemsPerPage:8,
            listLength:'',


            searchValue:''
        }
    }
    componentWillMount = () =>{
        //before mount check if user are logged in and userType is admin if not redirect to login page
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'admin'){
            this.props.router.push('/vartotojams');
            return '';
        }
        //request for patient list with default state of searchValue and activePage number
        this.getPatientList(this.state.searchValue, this.state.activePage);  
    }

    getPatientList = (searchValue, activePage) =>{
        
        let allPatientRequestLink = 'http://localhost:8080/api/patient/notbind?page='+activePage+'&size='+this.state.itemsPerPage
        let searchPatientrequestLink = 'http://localhost:8080/api/patient/notbind/'+searchValue+'/search?page='+activePage+'&size='+this.state.itemsPerPage
        let finalRequestLink = allPatientRequestLink;

        if(searchValue.length > 2){
           finalRequestLink = searchPatientrequestLink
        }else if(searchValue.length === 0){
           finalRequestLink = allPatientRequestLink
        }else{
            this.setState({
                patientList:(<h3>Įveskite bent 3 simbolius.</h3>),
            })
            return ''
        }

        axios.get(finalRequestLink)
        .then((response)=>{
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    if(this.state.searchValue > 2){
                        this.setState({
                            patientList:(<h3>Pacientų nerasta.</h3>)
                        })
                    }
                    return ''
                }
                this.setState({
                    patientList:(<h3>Pacientų nerasta.</h3>),
                })
            }else{
                this.setState({
                    patientList:<PatientListView patients={response.data.content.map(this.composePatient)}/>,
                    listInfo:response.data,
                    listLength:response.data.content.length,
                })
            }
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientList:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    bindClick = (patient_id) =>{
        axios.post("http://localhost:8080/api/admin/new/bind/"+this.props.params.userName+"/to/"+patient_id)
        .then((response)=>{
            this.getPatientList(this.state.searchValue, this.state.activePage);  
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientList:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })

    }

    composePatient = (patient, index) =>{
        return (
            <PatientListingItem 
                key={patient.id}
                patientId={patient.id}
                birthDate={patient.birthDate}
                fullName={patient.fullName}
                patientBindLink={<td><PatientBindLink index={index} bindClick={this.bindClick} patientId={patient.id}/></td>}
            />
        )
    }

    fielddHandler = (e) =>{
        this.setState({
            searchValue:e.target.value
        })
    }
    
    searchdHandler = (e) =>{
        e.preventDefault();
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() =>{
            this.getPatientList( 
                (this.state.searchValue.charAt(0).toUpperCase() + this.state.searchValue.slice(1)).trim(),
                0)
        } , 1000 )
        
        this.setState({
            activePage:0
        })
    }

     //handle paggination page changes 
    handlePageChange = (activePage) => {        
        if(activePage < 1){
            if(this.state.activePage > activePage && activePage > -1){
               
            }else{
                return ''
            }
        }
        this.getPatientList(this.state.searchValue, activePage);  

        //change activePage state to new page number
        this.setState({
            activePage:activePage
        })
    }

    //Show paggination div with props from state
    showPagination = () =>{
       
        return (
            <div className="text-center">
                <div>
                    <button className="btn btn-default" id="previousPage" onClick={() => this.handlePageChange(this.state.activePage - 1)}>⟨</button>
                    <button className="btn btn-default">{this.state.activePage + 1}</button>
                    <button className="btn btn-default" id="nextPage" onClick={() => this.handlePageChange(this.state.activePage + 1)}>⟩</button>
                </div>
             
            </div>
        )
    }


    render(){
        return(
        <div className="container">
            <section>
            <UserDetailsComponent  fullName={this.session.user.fullName}  other={
            <li className="navbar-text">
            <button onClick={() =>  this.props.router.goBack()} className="btn btn-default"> Atgal </button>
            </li>
            }/>
        
                <div className="panel-group">
                
                <p/>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3>Priskirkite pacientą gydytojui</h3>
                        </div>
                        <div className="panel-body">
                            {this.state.infoState}
                            <div className="col-sm-12">
                                <h4 className="text-center" >Prašome įvesti bent 3 simbolius.</h4>
                                <SearchFieldForm
                                        searchHandler={this.searchdHandler}
                                        fielddHandler={this.fielddHandler}
                                        searchValue={this.state.searchValue}
                                        searchPlaceHolder={"Pacientų paieška"}
                                        searchType={"text"}
                                    />
                            </div>
                            <div className="col-sm-12">
                                {this.state.patientList}
                                 {this.showPagination()}
                            </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}
