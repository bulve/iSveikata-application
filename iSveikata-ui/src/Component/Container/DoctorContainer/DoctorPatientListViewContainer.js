import React, {Component} from 'react';
import axios from 'axios';
import {CSVLink} from 'react-csv';

import PatientListingItem from '../AdminComponent/PatientListingItem';
import PatientListView from '../AdminComponent/PatientListView';
import SearchFieldForm from '../DoctorComponent/SearchFieldForm';
import { DoctorViewPatientLink } from '../LinksAndButtons/DoctorViewPatientLink';
import {NewRecordLink} from '../LinksAndButtons/NewRecordLink';
import { NewPrescriptionLink } from '../LinksAndButtons/NewPrescriptionLink';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';


export default class DoctorPatientListViewContainer extends Component{
    constructor(props){
        super(props)
        this.timeOut= ''
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.doctorInfo = JSON.parse(sessionStorage.getItem('doctor'))
        this.state = {
            patientListView:null,
           
            searchValue:'',
            patientTypeName:'Matyti visus pacientus',
            patientType:true,
            searchOn:false,

            listInfo:'',
            listLength:'',
            activePage:0,
            itemsPerPage:8,

            CSVData:'',
            downloadCSV:'',
            CSVButtonTitle:'Generuoti priskirtų pacientų sąrašą (CSV)'
        }
    }

    //before mount check state of session exist and session user state (loggetIn, userType)
    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'doctor'){
            this.props.router.push('/vartotojams');
            return '';
        }  
        if(this.doctorInfo !== null){
            if(this.doctorInfo.patientType){
                this.doctorInfo.searchOn ? 
                    this.getDoctorPatientBySearchValue(this.doctorInfo.patientPage, this.doctorInfo.searchValue) : 
                    this.getDoctorPatient (this.doctorInfo.patientPage)
            }else{
                this.doctorInfo.searchOn ? 
                this.getAllPatientBySearchValue(this.doctorInfo.patientPage, this.doctorInfo.searchValue) :
                this.getAllPatient(this.doctorInfo.patientPage) 
            }
            this.setState({
                activePage:this.doctorInfo.patientPage,
                patientType:this.doctorInfo.patientType,
                searchValue:this.doctorInfo.searchValue,
                searchOn:this.doctorInfo.searchOn,
                patientTypeName:this.doctorInfo.patientTypeName
            })
        }else{
            this.getDoctorPatient(this.state.activePage);
        }
    }

    resetDoctorInfoSession = () =>{
        sessionStorage.setItem('doctor', null)
        this.getDoctorPatient(0);
        this.setState({
            activePage:0,
            patientType:true,
            searchValue:'',
            searchOn:false,
            patientTypeName:'Vaizduoti visus pacientus.',
        })
    }

    generateCSVFile = () =>{

        this.setState({
            CSVButtonTitle:'Generuojama...'
        })
        axios.get('http://localhost:8080/api/doctor/'+this.session.user.userName+'/patient/csv')
        .then((response)=>{
            let data = response.data.map(this.composeCSVData);
            let date = new Date()
            if(response.data.length === 0 ){
                this.setState({
                    CSVButtonTitle:"Priskirtų pacientų nerasta."
                })
            }else{
                this.setState({
                    CSVData:data,
                    CSVButtonTitle:'Generuoti priskirtų pacientų sąrašą (CSV formatu).',
                    downloadCSV:(<CSVLink 
                                className="btn btn-default pull-right" data={data} 
                                filename={'Pacientų sąrašas_' + 
                                date.getFullYear() + '-' + 
                                (date.getMonth() + 1) + '-' + 
                                date.getDay() + '.csv'} >
                                    Atsisiųsti sąrašą
                                </CSVLink>)
                })
            }
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    CSVButtonTitle:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    composeCSVData = (data, index) =>{
        return {"Vardas": data[0], "Pavardė": data[1], "Asmens kodas": data[2], "Gimimo data": data[3] }
    }
    //send request for a list of patient wich ir bind to doctor userName and some paging info
    getDoctorPatient = (activePage) =>{
        axios.get('http://localhost:8080/api/doctor/'+this.session.user.userName+'/patient?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    return ''
                }
                this.setState({
                    patientListView:(<h3>Jūs neturite priskirtų pacientų.</h3>),
                })                
            }else{
                this.setState({
                    patientListView:<PatientListView patients={response.data.content.map(this.composePatient)} />,
                    listLength:response.data.content.length,
                    searchOn:false
                 })
            } 
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientListView:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    //send request for a list of patient and some paging info
    getAllPatient = (activePage) =>{
        axios.get('http://localhost:8080/api/patient/?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    return ''
                }
                this.setState({
                    patientListView:(<h3>Sistemos klaida, pacientų nėra.</h3>),
                })
            }else{
                this.setState({
                    patientListView:<PatientListView patients={response.data.content.map(this.composePatient)} />,
                    listInfo:response.data,
                    listLength:response.data.content.length,
                    searchOn:false

                })  
            }         
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientListView:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    patientClicSessionkHandler = (patientId, fullName, birthDate) =>{
       sessionStorage.setItem("patientInfo", JSON.stringify({id:patientId, fullName:fullName, birthDate:birthDate}))
    }
    //compose patient list item (row) to show it in table
    composePatient = (patient, index) =>{
        let patientViewLink = null

        //if composing patient by doctor userName add link to view patient details
        //else do not show patient details button
        if(this.state.patientType){
            patientViewLink=(
                <td><DoctorViewPatientLink index={index} 
                clickHandler={() => this.patientClicSessionkHandler(patient.id, patient.fullName, patient.birthDate)} 
                /></td>)
        }
        return (
            <PatientListingItem
                key={patient.id}
                patientId={patient.id}
                birthDate={patient.birthDate}
                fullName={patient.fullName}
    
                recordLink={<td><NewRecordLink 
                    index={index}  patientId={patient.id}
                    clickHandler={() => this.patientClicSessionkHandler(patient.id, patient.fullName, patient.birthDate)}
                    /></td>}
                prescriptionLink={<td><NewPrescriptionLink 
                    index={index} patientId={patient.id}
                    clickHandler={() => this.patientClicSessionkHandler(patient.id, patient.fullName, patient.birthDate)}
                    /></td>}
                doctorViewPatient={patientViewLink}                 
            />
        )
    }

    getDoctorPatientBySearchValue = (activePage, searchValue) =>{
        axios.get('http://localhost:8080/api/doctor/'+this.session.user.userName+'/patient/'
        +searchValue+'?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    if(this.state.searchValue > 2){
                        this.setState({
                            patientListView:(<h3>Tokių pacientų nerasta.</h3>)
                        })
                    }
                    return ''
                }
                this.setState({
                    patientListView:(<h3>Tokių pacientų nerasta.</h3>),
                    listLength:0
                })
            }else{  
                this.setState({
                    patientListView:<PatientListView patients={response.data.content.map(this.composePatient)} />,
                    listInfo:response.data,
                    listLength:response.data.content.length,
                    searchOn:true

                })
            }
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientListView:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    getAllPatientBySearchValue = (activePage, searchValue) =>{
        axios.get('http://localhost:8080/api/patient/search/'
        +searchValue+'?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    if(this.state.searchValue > 2){
                        this.setState({
                            patientListView:(<h3>Tokių pacientų nerasta.</h3>)
                        })
                    }
                    return ''
                }
                this.setState({
                    patientListView:(<h3>Tokių pacientų nerasta.</h3>),
                    
                })
            }else{  
                this.setState({
                    patientListView:<PatientListView patients={response.data.content.map(this.composePatient)} />,
                    listInfo:response.data,
                    listLength:response.data.content.length,
                    searchOn:true
                })
            }
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    patientListView:(<h3>Serverio klaida, bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }


    //in seacrh field change state value ot new event (e) value
    fielddHandler = (e) =>{
        this.setState({
            searchValue:e.target.value
        })
        
    }
    //search button click handling 
    searchHandler = (e) =>{
        clearTimeout(this.timeOut)
        e.preventDefault()
        if(this.state.searchValue.length > 2){
            if(this.state.patientType){
                this.timeOut = setTimeout(() =>{
                    this.getDoctorPatientBySearchValue(
                        0, 
                        (this.state.searchValue.charAt(0).toUpperCase() + this.state.searchValue.slice(1).toLowerCase()).trim())  
                } , 500 )
                
            }else{
                this.timeOut =  setTimeout(() =>{
                    this.getAllPatientBySearchValue(
                        0,
                        (this.state.searchValue.charAt(0).toUpperCase() + this.state.searchValue.slice(1).toLowerCase()).trim())    
                } , 500 )
            }
        }else if(this.state.searchValue.length === 0){
            if(this.state.patientType){
                this.timeOut = setTimeout(() =>{
                    this.getDoctorPatient(0)  
                } , 500 )
            }else{
                this.timeOut = setTimeout(() =>{
                    this.getAllPatient(0)  
                } , 500 )
            }
        }else{
            this.setState({
                patientListView:(<h3>Įveskit bent 3 simbolius</h3>),
            })
        }

        sessionStorage.setItem('doctor', JSON.stringify({
            patientType:this.state.patientType,
            patientPage:0,
            searchValue:this.state.searchValue,
            searchOn:(this.state.searchValue.length > 2 ? true : false),
            patientTypeName:this.state.patientTypeName
        }))
        
        this.setState({
            activePage:0,
        })
    }
    //on button click chnage patient from doctor patient or all patient and vice versa
    changePatients = () =>{
        if(this.state.patientType){
            this.getAllPatient(0)
            this.setState({
                patientTypeName:"Matyti savo pacientus",
                searchOn:false
            })
        }else{
            this.getDoctorPatient(0)
            this.setState({
                patientTypeName:"Matyti visus pacientus",
                searchOn:false
            })
        }
        sessionStorage.setItem('doctor', JSON.stringify({
            patientType:!this.state.patientType,
            patientPage:0,
            searchValue:this.state.searchValue,
            searchOn:false,
            patientTypeName:this.state.patientTypeName
        }))
        this.setState({
            patientType:!this.state.patientType,
            activePage:0
        })
    }

    //handle paggination page changes 
    handlePageChange = (activePage) => {
        if(activePage < 1 || this.state.listLength < this.state.itemsPerPage ){
            if(this.state.activePage > activePage && activePage > -1){
               
            }else{
                return ''
            }
        }
 
        //if patient type is true (means it's still doctor patient) 
        //request for new page with given active page number and doctro userName 
        if(this.state.patientType){
            if(this.state.searchOn){
                this.getDoctorPatientBySearchValue(activePage, this.state.searchValue)
            }else{
                this.getDoctorPatient(activePage);
            }
        }else{
            if(this.state.searchOn){
                this.getAllPatientBySearchValue(activePage, this.state.searchValue)
            }else{
                this.getAllPatient(activePage)
            }
        }

        sessionStorage.setItem('doctor', JSON.stringify({
            patientType:this.state.patientType,
            patientPage:activePage,
            searchValue:this.state.searchValue,
            searchOn:this.state.searchOn,
            patientTypeName:this.state.patientTypeName
        }))
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
      


    render() {
        return (
            <div className="container">
            <section>
                <UserDetailsComponent fullName={this.session.user.fullName}
                    other={<div className="navbar-text">
                                <button className="btn btn-default pull-right" onClick={this.generateCSVFile}>
                                    {this.state.CSVButtonTitle}
                                </button>
                                {this.state.downloadCSV}
                            </div>} />

                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3>Pacientų sąrašas</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-center">
                                
                                <h4>Prašome įvesti bent 3 simbolius</h4>
                                <SearchFieldForm 
                                    searchHandler={this.searchHandler}
                                    fielddHandler={this.fielddHandler}
                                    searchValue={this.state.searchValue}
                                    searchPlaceHolder={"Pacientų paieška"}
                                    searchType={"text"}
                                />
                                <button id="doctorResetPatientList" className='btn btn-default pull-left' onClick={this.resetDoctorInfoSession}>Atnaujinti pacientų sąrašą</button>
                                <button id="doctorChangePatientList" className='btn btn-default pull-right' onClick={this.changePatients}>{this.state.patientTypeName}</button>
                               
                            </div>
                            <div className="col-sm-12">
                                {this.state.patientListView}
                                {this.showPagination()}
                                {this.state.info}
                            </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}


