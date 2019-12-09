import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

//import SearchFieldForm from '../DoctorComponent/SearchFieldForm'
import PrescriptionListView from '../DoctorComponent/PrescriptionListView';
import PrescriptionListingItem from '../DoctorComponent/PrescriptionListingItem';
import { DetailsModalView } from '../DoctorComponent/DetailsModalView';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

// var backgroundStyle = {     height: '100%', width: '100%', zIndex: '3',
//                             position: 'fixed', top: '0', left: '0', background: 'rgba(255,255,255,0.8)', display:'none'}
// var recordDetailWindowStyle = {  height: '60%', width: '60%',  border: '2px solid black', zIndex: '4',
//                                 position: 'fixed', top: '20%', left: '20%', background: 'white', display:'block'}

class DruggistViewContainer extends Component{
    constructor(props){
        super(props)
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.patientInfo = JSON.parse(sessionStorage.getItem('patientInfo'))
        this.state = {
            prescriptions:null,
            infoState:'',
            info:(<h3>Pacientui išrašytų receptų nerasta.</h3>),

            viewContent:'',
            allPrescription:null,
            contentType:'record',

            infoDetails:null,
            infoHeader:"Recepto detali informacija",
            notActivePrescription:0
        }
    }


    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'druggist'){
            this.props.router.push('/vartotojams');
            return '';
        }  
        this.getPatientPrescriptions(this.state.activePage)       
    }

    getPatientPrescriptions = (activePage) =>{
        axios.get('http://localhost:8080/api/patient/'
        +this.props.params.patientId+'/prescription/druggist')
        .then((response)=>{
            if(response.data.length === 0){
                this.setState({
                    viewContent:this.state.info,
                })
            }else{
                this.setState({
                    viewContent:<PrescriptionListView prescription={response.data.map(this.composePrescription)}/>,
                    allPrescription:response.data.content,
                    })
            }
           
            
        })
        .catch((error) => {
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
    showDetails = (prescriptionId) =>{    
        if(document.getElementById('myModal').style.display === '' || document.getElementById('myModal').style.display === 'none'){
            document.getElementById('modalButton').click()
        }
        this.loadSpecificPrescription(prescriptionId)
    }

    composePrescription = (prescription, index) =>{
        return(
            <PrescriptionListingItem 
                key={index}
                index={index}
                id={prescription.id}
                prescriptionDate={prescription.prescriptionDate}
                expirationDate={prescription.expirationDate}
                ingredientName={prescription.apiTitle}
                showDetails={this.showDetails}
            />
        )
    }
    prescriptionUsageSubmit = (prescriptionId) =>{
        let currentDate = new Date();
        axios.post('http://localhost:8080/api/prescription/'+prescriptionId+'/new/usage',{
            usage:{
                usageDate:currentDate
            },
            userName:this.session.user.userName,
        })
        .then((response) => {
            this.setState({
                infoState:<div className="alert alert-success"><strong>{response.data}</strong></div>,
            })
            document.getElementById('modalButton').click()
            
        })
        .catch((error) =>{
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    infoState:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }


    loadSpecificPrescription = (prescriptionId) =>{
        axios.get('http://localhost:8080/api/prescription/'+prescriptionId)
        .then((response) => {
            this.setState({
                    infoDetails:this.composeSpecificPrescription(response.data, prescriptionId),
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


    composeSpecificPrescription = (prescription, prescriptionId) => {
       
        return (<div>
                <p>Recepto išrašymo data: {prescription.prescriptionDate}</p>
                <p>Receptas galioja iki: {prescription.expirationDate}</p>
                <p>Recepto panaudojimų skaičius: {prescription.useAmount}</p>
                <p>Vaisto veiklioji medžiaga: {prescription.apiTitle}</p>
                <p>Veikliosios medžiagos kiekis dozėje: {prescription.amount}</p>
                <p>Matavimo vienetai: {prescription.apiUnits}</p>
                <p>Vartojimo aprašymas: {prescription.description}</p>
                <button id="prescriptionUsageSubmit" onClick={() => this.prescriptionUsageSubmit(prescriptionId) }className='btn btn-default'>Pažymėti pirkimo faktą</button>
                
        </div>)
    }

    fielddHandler = (e) =>{
        this.setState({
            searchValue:e.target.value
        })
    }
    searchHandler = (e) =>{
        e.preventDefault()
       
    }


    render() {
        return (
            <div className="container">
            <section>
            <UserDetailsComponent fullName={this.session.user.fullName}
                other={
                <button onClick={() =>  this.props.router.goBack()} className="btn btn-default navbar-text"> Atgal </button>
                }
            />
            <p/>
                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4>Klientas: {this.patientInfo.fullName}</h4>
                            <p>Gimimo data: {this.patientInfo.birthDate}</p>
                            <p>Asmens kodas: {this.patientInfo.id}</p>
                        </div>
                        <div className="panel-body">
                            <div className="col-sm-12">
                                {this.state.infoState}

                                {this.state.viewContent}
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

const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}



export default connect(mapStateToProps)(DruggistViewContainer)

