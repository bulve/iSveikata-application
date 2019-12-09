import React, {Component} from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker,isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import 'moment/locale/lt';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

export default class DoctorStatisticContainer extends Component{
    constructor(props){
        super(props)
        this.session = JSON.parse(sessionStorage.getItem('session'))
        this.state = {
            dateFrom: '2010-02-01',
            dateTill: '2010-04-14',
            data:[],
            chart:null,
            totalPatient:0,
            totalTime:0,
            total:null,
            
            startDate: moment().startOf('month'),
            endDate: moment(),
            focusedInput: null,
        }
    }

    //before mount check state of session exist and session user state (loggetIn, userType)
    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'doctor'){
            this.props.router.push('/vartotojams');
            return '';
        }  
    }
    submitHandler = () =>{

        let start = new Date(this.state.startDate._d)
        let end = new Date(this.state.endDate._d)

        var startDate =  start.getFullYear() 
        + '-'+ ((start.getMonth()+1)<10 ? 0+''+(start.getMonth()+1): (start.getMonth()+1)) 
        + '-' + (start.getDate()<10? 0+''+start.getDate(): start.getDate());

        var endDate =  end.getFullYear() 
                + '-'+ ((end.getMonth()+1)<10 ? 0+''+(end.getMonth()+1): (end.getMonth()+1)) 
                + '-' + (end.getDate()<10? 0+''+end.getDate(): end.getDate());

        
        this.setState({
            totalPatient: 0,
            totalTime:0
        })
        axios.get("http://localhost:8080/api/record/doctor/"+
        this.session.user.userName+"/statistic/"+startDate+"/"+endDate,)
        .then((response) =>{
            if(response.data.length === 0){
                this.setState({
                    chart:(<h3>Šiomis dienomis gydytojas neturi sukurtų ligos įrašų</h3>),
                    total:null,
                    totalPatient: 0,
                    totalTime:0
                })
            }else{
                this.setState({
                    data:response.data.map(this.composeData)
                })
                this.showStatistic()
            }
        })
        .catch(error => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    chart:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
          });
    }

    composeData = (data, index) =>{
        this.setState({
            totalPatient: parseInt(this.state.totalPatient, 10) + data[1],
            totalTime: parseInt(this.state.totalTime, 10) + data[2]
        })
        return {date:data[0], patient:data[1], time:data[2]}
    }
    
    fieldHandler = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    showStatistic = () =>{

        let hours = Math.floor(this.state.totalTime / 60)
        let minutes = Math.floor(Math.round(((this.state.totalTime / 60 - hours) * 60) * 10) / 10)
       
        this.setState({
            chart:(  <ResponsiveContainer height={300}>
                        <LineChart width={1000} height={300} data={this.state.data} 
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey="date"/>
                        <YAxis dataKey="time"/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend verticalAlign="top" height={36} iconSize={20} />
                        <Line type="monotone" dataKey="patient" name="Per dieną priimti pacientai" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="time" name="Bendra dienos vizitų trukmė" unit=" min" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>),
            total:(<div>
                    <p><strong>Per pasirinktą laikotarpį priimta <i> {this.state.totalPatient}</i> pacientų.</strong></p>
                    <p><strong>Bendra pasirinkto laikotarpio vizitų trukmė: <i> {hours} h {minutes} min.</i></strong></p>
                </div>)  
        })
        
    
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
                            <h3>Gydytojo darbo dienų statistika</h3>
                        </div>

                        <div className="panel-body">
                            <div className="text-center">
                            <h4>Nurodykite laikotarpį darbo dienų statistikai pateikti:</h4>
                            <DateRangePicker
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                startDatePlaceholderText="Pradžios data"
                                endDatePlaceholderText="Pabaigos data"
                                displayFormat="YYYY-MM-DD"
                                onDatesChange={({ startDate, endDate }) => { this.setState({ startDate:startDate, endDate:endDate })}}
                                focusedInput={this.state.focusedInput}
                                onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                numberOfMonths={1}
                                />
                            </div>
                            <div className="text-center">
                                <button id="showDoctorStatisticButton" onClick={this.submitHandler} className="btn btn-default" type="submit" >Pateikti statistiką</button> 
                            </div>
        
                            <div> 
                            {this.state.total}
                            {this.state.chart}
                            </div>
                            
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}

