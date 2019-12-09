import React, {Component} from 'react';
import axios from 'axios';

import PrescriptionListingItem from '../DoctorComponent/PrescriptionListingItem';
import PrescriptionListView from '../DoctorComponent/PrescriptionListView';
import RecordListingItemDemo from '../DoctorComponent/RecordListingItemDemo';
import RecordListViewDemo from '../DoctorComponent/RecordListViewDemo';
import { DetailsModalView } from '../DoctorComponent/DetailsModalView';
import PrescriptionUsageListView from '../DoctorComponent/PrescriptionUsageListView';
import PrescriptionUsageListingItem from '../DoctorComponent/PrescriptionUsageListingItem';
import { NewRecordLink } from '../LinksAndButtons/NewRecordLink';
import { NewPrescriptionLink } from '../LinksAndButtons/NewPrescriptionLink';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';



export default class DoctorPatientViewContainer extends Component{
    constructor(props){
        super(props)
        this.session =  JSON.parse(sessionStorage.getItem('session'))
        this.patientInfo = JSON.parse(sessionStorage.getItem('patientInfo'))
        this.state = {
            patient:'',
            recordDetails:'',
            notFoundRecord:(<h3>Ligos istorija tuščia.</h3>),
            notFoundPrescription:(<h3>Išrašytų receptų pacientas neturi.</h3>),
            viewContent:'',
            contentType:'record',

            activePage:0,
            itemsPerPage:8,
            listLength:'',

            infoHeader:'',
            infoDetails:'',

            prescriptionUsage:null

        }
    }

    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true  || this.session.user.userType !== 'doctor'){
            this.props.router.push('/vartotojams');
            return '';
        } 
       this.loadRecords(this.state.activePage);
    }
    //load all patient medical record and compose to view component
    loadRecords = (activePage) =>{
        axios.get('http://localhost:8080/api/patient/'
        +this.patientInfo.id+'/record?page='
        +activePage+'&size='+this.state.itemsPerPage)
        .then((response) => {
            document.getElementById("record-tab").style.background = "lightGrey"

            if(response.data.content.length === 0){
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    return ''
                }else{
                    this.setState({
                        viewContent:this.state.notFoundRecord,
                    })
                }
            }else{
                this.setState({
                    viewContent:<RecordListViewDemo records={response.data.content.map(this.composeRecords)} />,
                    listLength:response.data.content.length,
                })
                
            }
        })
        .catch((error) =>{
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    viewContent:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
     //load all patient prescriptions and compose to view component
     loadPrescriptions = (activePage) =>{
        axios.get('http://localhost:8080/api/patient/'
        +this.patientInfo.id+'/prescription?page='
        +activePage+'&size='+this.state.itemsPerPage)
        .then((response) => {
            if(response.data.content.length === 0){
                if(activePage !== 0){
                    
                    this.setState({
                        activePage:activePage - 1
                    })
                    return ''
                }else{
                    this.setState({
                        viewContent:this.state.notFoundPrescription,
                    })
                }
            }else{
                this.setState({
                    viewContent:<PrescriptionListView 
                                 useAmountColumnName={<th>Panaudojimai</th>}
                                prescription={response.data.content.map(this.composePrescriptions)} />,
                    listLength:response.data.content.length,                   
                })
            }
            
        })
        .catch((error) =>{
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    viewContent:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    composeRecords = (record,index) =>{
        // var date = new Date(record.appointment.date)
        // var newDate =  date.getFullYear() 
        // + '-'+ ((date.getMonth()+1)<10 ? 0+''+(date.getMonth()+1): (date.getMonth()+1)) 
        // + '-' + (date.getDate()<10? 0+''+date.getDate(): date.getDate());
        return(
            <RecordListingItemDemo
                key={index}
                index={index}
                id={record.id}
                appDate={record.appointmentDate}
                icd={record.icdCode}
                doctorName={record.doctorFullName}
                showDetails={this.showRecordDetails}
            />
        )
    }
     //compose prescription list to specific listing item (view component)
     composePrescriptions = (prescription, index) =>{
        return(
            <PrescriptionListingItem 
                key={index}
                index={index}
                id={prescription.id}
                prescriptionDate={prescription.prescriptionDate}
                expirationDate={prescription.expirationDate}
                ingredientName={prescription.apiTitle}
                useAmount={prescription.useAmount}
                showDetails={this.showPrescriptionDetails}
            />
        )
    }

    

    loadSpecificRecord = (recordId) =>{
        axios.get('http://localhost:8080/api/record/'+recordId)
        .then((response) => {
            this.setState({
                infoDetails:this.composeSpecificRecord(response.data),
                infoHeader:"Ligos įrašo detali informacija"
                })
            
        })
        .catch((error) =>{
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    infoDetails:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    composeSpecificRecord = (record) => {
        var yesValue = 'Taip';
        var noValue = 'Ne';

        var compensable = record.compensable === true? yesValue:noValue;
        var repetitive = record.repetitive === true? yesValue:noValue;

        return (<div>
                <p>Ligos įrašo data: {record.appointmentDate}</p>
                <p>Ligos kodas: {record.icdCode}</p>
                <p>Ligos aprašymas: {record.icdDescription}</p>
                <p>Ligos įrašą padaręs gydytojas: {record.doctorFullName} </p>
                <p>Vizito trukmė: {record.appoitmentDuration}</p>
                <p>Vizitas kompensuojamas? {compensable}</p>
                <p>Vizitas pakartotinis? {repetitive}</p>
                <p>Vizito aprašymas: {record.appointmentDescription}</p>
        </div>)
    }

    
   //request for single prescription and compose it to view object
   loadSpecificPrescription = (prescriptionId) =>{
        axios.get('http://localhost:8080//api/prescription/'+prescriptionId)
        .then((response) => {
            this.setState({
                    infoDetails:this.composeSpecificPrescription(response.data),
                    infoHeader:"Recepto detali informacija"
                })
            
        })
        .catch((error) =>{
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    infoDetails:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    //compose single object to spcific view object
    composeSpecificPrescription = (prescription) => {
       
        return (<div>
                <p>Recepto išrašymo data: {prescription.prescriptionDate}</p>
                <p>Receptas galioja iki: {prescription.expirationDate}</p>
                <p>Receptą išrašęs gydytojas: {prescription.doctorFullName} </p>
                <p>Recepto panaudojimų skaičius: {prescription.useAmount}</p>
                <p>Vaisto veiklioji medžiaga: {prescription.apiTitle}</p>
                <p>Veikliosios medžiagos kiekis dozėje: {prescription.amount}</p>
                <p>Matavimo vienetai: {prescription.apiUnits}</p>
                <p>Vartojimo aprašymas: {prescription.description}</p>
        </div>)
    }

    getPrescriptionUsage = (id) =>{
        axios.get('http://localhost:8080/api/prescription/'+id+'/usages')
        .then((response)=>{
            if(response.data.length === 0){
                this.setState({
                    prescriptionUsage:(<p><b>Receptas nepanaudotas.</b></p>)
                })
            }
            else{
                this.setState({
                    prescriptionUsage:<PrescriptionUsageListView 
                                        usage={response.data.map(this.composeUsage)}/>
                })
            }     
            
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    prescriptionUsage:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    composeUsage= (usage, index) =>{
        return (
             <PrescriptionUsageListingItem
                key={index}
                date={usage.usageDate}
                druggistName={usage.druggistFullName}
            />
        )
    }
    //on medical record tab click show list of medical record
    showMedicalRecord = () =>{
        document.getElementById("record-tab").style.background = "lightGrey"
        document.getElementById("prescription-tab").style.background = "none"
        
        this.setState({
            activePage:0,
            contentType:'record'
        })
        this.loadRecords(0)
    }
    //on prescription tab click show list of prescription
    showPrescription = () =>{
        document.getElementById("record-tab").style.background = "none"
        document.getElementById("prescription-tab").style.background = "lightGrey"

        this.setState({
            activePage:0,
            contentType:'prescription'
        })
        this.loadPrescriptions(0) 
    }

    //on medical record row click show record details
    showRecordDetails = (rowId) =>{
        if(document.getElementById('myModal').style.display === '' || document.getElementById('myModal').style.display === 'none'){
            document.getElementById('modalButton').click()
        }
        this.loadSpecificRecord(rowId);
        this.setState({
            prescriptionUsage:null
        })
    }
    //on prescription click show sprescription details
    showPrescriptionDetails = (rowId) =>{
        if(document.getElementById('myModal').style.display === '' || document.getElementById('myModal').style.display === 'none'){
            document.getElementById('modalButton').click()
        }
        this.getPrescriptionUsage(rowId)
        this.loadSpecificPrescription(rowId);
    }



     //handle paggination page changes 
     handlePageChange = (activePage) => {
        if(activePage < 1){
            if(this.state.activePage > activePage && activePage > -1){
    
            }else{
                return ''
            }
        }
        //by content type (record/prescription) send request for specific page
       if(this.state.contentType === 'record'){
            this.loadRecords(activePage);
        }else{
            this.loadPrescriptions(activePage)
        }
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
                        <button onClick={() =>  this.props.router.goBack()} className="btn btn-default"> Atgal </button>
                    </div>}
            />    
            <p/>
                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                        <h3>Paciento kortelė</h3>
                        <div className="text-center">
                        <NewRecordLink  patientId={this.patientInfo.id} />
                        <NewPrescriptionLink  patientId={this.patientInfo.id}/>
                        </div>
                        <h4>Pacientas: {this.patientInfo.fullName}</h4>
                        <p>Gimimo data: {this.patientInfo.birthDate}</p>
                        <p>Asmens kodas: {this.patientInfo.id}</p>
                       
                        </div>
                        <div className="panel-body">
                            <div className="col-sm-12">
                                 <ul className="nav nav-tabs">
                                    <li className="col-sm-6">
                                        <a className="text-center" id="record-tab"
                                            onClick={this.showMedicalRecord} 
                                            data-toggle="pill" >Paciento ligos įrašai</a>
                                    </li>
                                    <li className="col-sm-6" >
                                        <a className="text-center" id="prescription-tab"
                                            onClick={this.showPrescription} 
                                            data-toggle="pill" >Paciento receptai</a>
                                    </li>
                                </ul>
                                <br/>
                                {this.state.viewContent}
                                {this.showPagination()}
                                <a href="#" id="modalButton" data-toggle="modal" data-backdrop="false" data-target="#myModal" className="hidden" ></a>
                                <DetailsModalView
                                    infoHeader={this.state.infoHeader}
                                    infoDetails={this.state.infoDetails}
                                    prescriptionUsage={this.state.prescriptionUsage}
                                />
                            </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}

