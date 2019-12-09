import React, {Component} from 'react';
import axios from 'axios';

import RecordListingItem from '../DoctorComponent/RecordListingItem';
import RecordListView from '../DoctorComponent/RecordListView';
import { DetailsModalView } from '../DoctorComponent/DetailsModalView';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

export default class PatientRecordContainer extends Component{
    constructor(props){
        super(props)
        this.session =  JSON.parse(sessionStorage.getItem('session'));
        this.patientInfo = JSON.parse(sessionStorage.getItem('patientInfo'))
        this.state = {
            records:null,
            notFoundRecord:(<h3>Ligos istorija tuščia.</h3>),
            recordDetails:'',
            patient:'',
            opendRecordRow:'',
            viewContent:'',
            contentType:'record',
            patientName:'',

            listInfo:'',

            activePage:0,
            itemsPerPage:8,
            listLength:'',
            
            infoDetails:'',
            infoHeader:'',
            
        }
    } 
    componentWillMount = () =>{
            if(this.session === null || this.session.patient.loggedIn !== true){
            this.props.router.push('/pacientams');
            return '';
            }
            this.loadRecords(this.state.activePage);
    }


    //load all patient medical record and compose to view component
    loadRecords = (activePage) =>{
        axios.get('http://localhost:8080/api/patient/'
        +this.session.patient.patientId+'/record?page='
        +activePage+'&size='+this.state.itemsPerPage)
        .then((response) => {
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
                    viewContent:this.state.notFoundRecord
                })
            }else{
                this.setState({
                    viewContent:<RecordListView records={response.data.content.map(this.composeRecords)} />,
                    listInfo:response.data,
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
                    patientList:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }



    composeRecords = (record,index) =>{
        return(
            <RecordListingItem
                key={index}
                id={record.id}
                appDate={record.appointmentDate}
                icd={record.icdCode}
                doctorName={record.doctorFullName }
                showDetails={this.showRecordDetails}
            />
        )
    }


    loadSpecificRecord = (recordId) =>{
        axios.get('http://localhost:8080/api/record/'+recordId)
            .then((response) => {
            this.setState({
                    infoDetails:this.composeSpecificRecord(response.data),
                    infoHeader: this.composeSpecificRecordHeader(response.data)
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

    composeSpecificRecordHeader = (record) => {  
        return  (<div>
                    <p>Ligos įrašo detali informacija</p>
                </div>)
                
    }

    composeSpecificRecord = (record) => {
        var yesValue = 'Taip';
        var noValue = 'Ne';

        var compensable = record.compensable === true? yesValue:noValue;
        var repetitive = record.repetitive === true? yesValue:noValue;

        return (<div >
                <p>Ligos įrašo data: {record.appointmentDate}</p>
                <p>Ligos kodas: {record.icdCode}</p>
                <p>Ligos kodo aprašymas: {record.icdDescription}</p>
                <p>Ligos įrašą padaręs gydytojas: {record.doctorFullName} </p>
                <p>Vizito trukmė: {record.appoitmentDuration}</p>
                <p>Vizitas kompensuojamas? {compensable}</p>
                <p>Vizitas pakartotinis? {repetitive}</p>
                <p>Aprašymas: {record.appointmentDescription}</p>
        </div>)
    }

     //on medical record row click show record details
     showRecordDetails = (rowId) =>{
        if(document.getElementById('myModal').style.display === '' || document.getElementById('myModal').style.display === 'none'){
            document.getElementById('modalButton').click()
        }
        this.loadSpecificRecord(rowId);
       
    }


    //handle paggination page changes 
    handlePageChange = (activePage) => {
        if(activePage < 1 || this.state.listLength < this.state.itemsPerPage ){
            if(this.state.activePage > activePage && activePage > -1){
               
            }else{
                return ''
            }
        }
    
        //by content type (record/prescription) send request for specific page
        this.loadRecords(activePage);
        
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
            <UserDetailsComponent fullName={this.session.patient.fullName}
            other={<button onClick={() =>  this.props.router.goBack()} className="btn btn-default navbar-text"> Atgal </button>} 
        />
                        <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3> Ligos istorijos įrašai</h3>
                        </div>
                        <div className="panel-body">
                            <div className="col-sm-12">
                                {this.state.viewContent}
                                {this.showPagination()}
                                <a href="#" id="modalButton" data-toggle="modal" data-backdrop="false" data-target="#myModal" className="hidden" ></a>
                                <DetailsModalView
                                    infoHeader={this.state.infoHeader}
                                    infoDetails={this.state.infoDetails}
                                />
                           </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}