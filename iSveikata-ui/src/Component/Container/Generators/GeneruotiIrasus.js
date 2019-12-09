import React, {Component} from 'react';
import axios from 'axios';

export default class GeneruotiIrasus extends Component {
    constructor(props){
        super(props)
        this.state = {
            doctor:null,
            patient:null,
            icd:null,
            amount:0,
            ipsum:[],
            years:2010,
            month:1,
            day:20,
            recordPerDay:1,
            totalRequest:0,
            recordTotal:1,

            page:20,

            stopInterval:false
            
        }
    }


    generateRecords = () =>{
       
        for (let i = 0; i < this.state.amount; i++) { 
           setInterval(() =>{
                this.generateMedicalRecord()
            } , 1000 )  
        }
    }

    generatePrescriptions = () =>{

        for (let i = 0; i < this.state.amount; i++) { 
         setInterval(() =>{
                this.generatePrescription()
            } , 1000 )  
        }
    }

    generateMedicalRecord = () =>{
        if(this.state.recordTotal > 10000){
            let page = parseInt(this.state.page, 10) + 1
            this.getPatient(page)
            
            this.setState({
                recordTotal:0,
                page:page
            })
            return ''
        }

        if(this.state.years === 2018 && this.state.month === 2 && this.state.day === 30){
            
            this.setState({
                years:2010
            })
            return ''
        }
        let newDate = this.state.years + '-' + this.state.month + '-' + this.state.day
        
        axios.post("http://localhost:8080/api/doctor/new/record", {
                    appointment: {
                    duration: Math.floor(Math.random() * 20),
                    description: this.state.ipsum[Math.floor(Math.random() * this.state.ipsum.length)].substring(0, 255),
                    date: newDate
                    },
                    medicalRecord: {
                    compensable: true,
                    repetitive: false
                    },
                    icdCode: this.state.icd[Math.floor(Math.random() * this.state.icd.length)].icd,
                    patientId: this.state.patient[Math.floor(Math.random() * this.state.patient.length)].id,
                    userName: this.state.doctor[Math.floor(Math.random() * this.state.doctor.length)].userName
                })
                .then(() => {
                    
                })
                .catch((erorr) => {
                    
                })

        if(this.state.recordPerDay < 5001){
            this.setState({
                recordPerDay:this.state.recordPerDay+1,
                recordTotal:this.state.recordTotal+1
            })
        }else{
            if(this.state.day > 29){
                if(this.state.month > 11){
                    this.setState({
                        day:1,
                        month:1,
                        years:this.state.years+1
                    })
                }else{
                    this.setState({
                        day:1,
                        month:this.state.month+1
                    })
                }
            }else{
                this.setState({
                    day:this.state.day+1
                })
            }
            this.setState({
                recordPerDay:Math.floor(Math.random() * 900) + 4000,
            })
        }
        
        
    }



    generatePrescription = () =>{

        if(this.state.recordTotal > 20000){
            let page = parseInt(this.state.page, 10) + 1
            this.getPatient(page)
            
            this.setState({
                recordTotal:0,
                page:page
            })
            return ''
        }
      
    
        if(this.state.years === 2018 && this.state.month === 2 && this.state.day === 30){
            
            this.setState({
                years:2010,
            })
            return ''
        }
        let expDay = this.state.day + Math.floor(Math.random() * 30)
        let expMonth = this.state.month
        let expYears = this.state.years

        if(expDay > 30){
            
            expDay = parseInt(expDay, 10) - 30
            
            if(expMonth > 11){
                expMonth = 1
                expYears = parseInt(expYears, 10) + 1
            }
            expMonth = parseInt(expMonth, 10) + 1
            
        }

        let prescriptionDate = this.state.years + '-' + this.state.month + '-' + this.state.day
        let expirationDate = expYears + '-' + expMonth + '-' + expDay

        axios.post('http://localhost:8080/api/doctor/new/prescription', {
                prescription:{
                    expirationDate:expirationDate,
                    prescriptionDate:prescriptionDate,
                    description:this.state.ipsum[Math.floor(Math.random() * this.state.ipsum.length)].substring(0, 255),
                    ingredientAmount:Math.floor(Math.random() * 20),
                    // ingredientUnit:this.state.substanceUnit,
                },
                patientId: this.state.patient[Math.floor(Math.random() * this.state.patient.length)].id,
                userName: this.state.doctor[Math.floor(Math.random() * this.state.doctor.length)].userName,
                apiTitle:this.state.api[Math.floor(Math.random() * this.state.api.length)].apiTitle,
            })
            .then(() => {
                
            })
            .catch((erorr) => {
                
            })


        // if(this.state.recordPerDay < 5001){
        //     this.setState({
        //         recordPerDay:this.state.recordPerDay+1,
        //         recordTotal:this.state.recordTotal+1
        //     })
        // }else{
        //     if(this.state.day > 29){
        //         if(this.state.month > 11){
        //             this.setState({
        //                 day:1,
        //                 month:1,
        //                 years:this.state.years+1
        //             })
                    
        //         }else{
        //             this.setState({
        //                 day:1,
        //                 month:this.state.month+1
        //             })
        //         }
        //     }else{
        //         this.setState({
        //             day:this.state.day+1
        //         })
        //     }
        //     this.setState({
        //         recordPerDay:Math.floor(Math.random() * 900) + 4000,
        //     })

            
        // }
    }

    getData = () => {
        this.getDoctor()
        this.getPatient(this.state.page)
        this.getIcd()
        this.getImpsum()
        this.getApi()
    }

    getApi = () =>{
        axios.get('http://localhost:8080/api/api')
        .then((response)=>{
            this.setState({
                api:response.data.map(this.composeApi)
            })
            
        })
        .catch((erorr) => {
            
        })
    }

    composeApi = (api) =>{
        return {apiTitle:api.ingredientName}
    }

    getIcd = () =>{
        axios.get('http://localhost:8080/api/icd')
        .then((response)=>{
            this.setState({
                icd:response.data.map(this.composeIcd)
            })
            
        })
        .catch((erorr) => {
            
        })
    }

    composeIcd = (icd) =>{
        return {icd:icd.icdCode}
    }

    getPatient = (page) =>{
        axios.get('http://localhost:8080/api/patient/?page='+page+'&size=2000')
        .then((response)=>{
            this.setState({
                patient:response.data.content.map(this.composePatients)
            })
            
        })
        .catch((erorr) => {
            
        })
    }

    composePatients = (patient) =>{
        return {id:patient.id}
    }

    getDoctor = () =>{
        axios.get('http://localhost:8080/api/doctor?page=1&size=2000')
        .then((response)=>{
            this.setState({
                doctor:response.data.content.map(this.composeDoctors)
            })
            
        })
        .catch((erorr) => {
            
        })
    }

    composeDoctors = (doctor) =>{
        return {userName:doctor.userName}
    }

    getConsoleData = () =>{
        
    }

    onChange = (e) =>{
        this.setState({
            amount:e.target.value
        })
    }
    onChangePage = (e) =>{
        this.setState({
            page:e.target.value
        })
    }

    getImpsum = () =>{
        
            axios.get('https://baconipsum.com/api/?type=meat-and-filler')
            .then((response)=>{
                this.setState({
                    ipsum:response.data
                })
                //
            })
            .catch((erorr) => {
                
            })
    
    }


    render() {
        return (
            <div className="container">
                <section>
                    <div >Generuoti įrašus</div>
                    <button onClick={this.generateRecords}>Generuoti įrašus →</button>
                    <input onChange={this.onChange} placeholder="kiek?"/>
                    <button onClick={this.generatePrescriptions}>← Generuoti receptus</button>
                    <button onClick={this.getConsoleData}>Konsolė</button>
                    <input onChange={this.onChangePage} placeholder="pacientų puslapis"/>
                    <button onClick={this.getData}>Gauti duomenis</button>
                    <button onClick={() => this.getPatient(this.state.page)}>Gauti paciento duomenis</button>


                </section>
            </div>)
    }
} 