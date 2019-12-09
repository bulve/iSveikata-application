import React, {Component} from 'react';
import axios from 'axios';

import DoctorListView from '../AdminComponent/DoctorListView';
import DoctorListingItem from '../AdminComponent/DoctorListingItem';
import {DoctorBindLink} from '../../Container/LinksAndButtons/DoctorBindLink';
import SearchFieldForm from '../DoctorComponent/SearchFieldForm';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';


export default class AdminBindDoctorPartContainer extends Component{
    constructor(props){
        super(props);
        this.session =  JSON.parse(sessionStorage.getItem('session'))
        this.state = {
            search:'',
            doctorList:'',
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
        //load all active doctor from api
        this.getAllDoctor(this.state.activePage)
       
    }
    //method to load all doctor from api
    getAllDoctor = (activePage) =>{
        //activeNumber is a page number
        axios.get('http://localhost:8080/api/doctor?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                //if givent activePage number is not 0 and the response data lenght is 0 
                //do not change content and stay at the same page
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    if(this.state.searchValue > 2){
                        this.setState({
                            doctorList:(<h3>Pacientų nerasta.</h3>)
                        })
                    }
                    return ''
                }
                //if active page is 0 so no doctor found at all
                this.setState({
                    doctorList:(<h3>Sistemoje nesukurta nė viena gydytojo paskyra.</h3>),
                })
            }else{
                //if some content found set that content to doctorList as table view
                this.setState({
                    doctorList:<DoctorListView doctors={response.data.content.map(this.composeDoctor)}/>,
                    listInfo:response.data,
                    listLength:response.data.content.length,
                })
            }
        })
        .catch((error) => {
            //if server response as 401 (Unauthorized) redirect to logout page
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    doctorList:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }

    //on search get all doctor by search value and specific page by activePage
    getAllDoctorBySearchValue = (searchValue, activePage) =>{
        axios.get('http://localhost:8080/api/doctor/'+searchValue+'/search?page='+activePage+'&size='+this.state.itemsPerPage)
        .then((response)=>{
            if(response.data.content.length === 0){
                //if givent activePage number is not 0 and the response data lenght is 0 
                //do not change content and stay at the same page
                if(activePage !== 0){
                    this.setState({
                        activePage:activePage - 1
                    })
                    if(this.state.searchValue > 2){
                        this.setState({
                            doctorList:(<h3>Pacientų nerasta.</h3>)
                        })
                    }
                    return ''
                }
                //if active page is 0 so no doctor found by search value
                this.setState({
                    doctorList:(<h3>Tokio gydytojo sistemoje nėra.</h3>),
                })
            }else{
                this.setState({
                    doctorList:<DoctorListView doctors={response.data.content.map(this.composeDoctor)}/>,
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
                    doctorList:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                })
            }
        })
    }
    //compose any given doctor to a table row 
    composeDoctor = (doctor, index) =>{
        return(
            <DoctorListingItem
                key={index}
                fullName={doctor.fullName}
                userName={doctor.userName}
                specialization={doctor.specialization}
                doctorBindLink={<DoctorBindLink userName={doctor.userName}/>}
            />)
    }
    
    //handle search field changes
    fielddHandler = (e) =>{
        this.setState({
            searchValue:e.target.value
        })
    }
    //handle search request and decide to search by searchValue or call for a normal request for a doctors
    searchdHandler = (e) =>{
        e.preventDefault();
        if(this.state.searchValue.length > 2){
            this.getAllDoctorBySearchValue(this.state.searchValue, 0)
        }else if(this.state.searchValue.length === 0){
            this.getAllDoctor(0)
        }else{
            //if searchValue is too short give a message about it
            this.setState({
                doctorList:(<h3>Įveskite bent 3 simbolius.</h3>),
            })
        }

        this.setState({
            activePage:0
        })
    }

     //handle paggination page changes 
     handlePageChange = (activePage) => {
        //if active page is less than 1 
        //check is that page is 0 and stop from geting lower than 0 activePage
        if(activePage < 1){
            if(this.state.activePage > activePage && activePage > -1){
               
            }else{
                return ''
            }
        }
        //if searchValue longer than 2 letter call for search request to api
        //else call for normal request to api
        //decide which request to call
        if(this.state.searchValue.length > 2){
            //sen request for specific page when search value length more than 2
            this.getAllDoctorBySearchValue(this.state.searchValue, activePage)
        }else{
            //send request for specific page when there is not search value
            this.getAllDoctor(activePage);
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


    
    render(){
        return(
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
                            <h3>Priskirkite gydytojui pacientą</h3>
                        </div>
                        <div className="panel-body">
                            <div className="col-sm-12">
                            <h4 className="text-center" >Prašome įvesti bent 3 simbolius.</h4>
                            <SearchFieldForm
                                    searchHandler={this.searchdHandler}
                                    fielddHandler={this.fielddHandler}
                                    searchValue={this.state.searchValue}
                                    searchPlaceHolder={"Gydytojų paieška"}
                                    searchType={"text"}
                                />
                            </div>
                            <div className="col-sm-12">
                                {this.state.doctorList}
                                {this.showPagination()}
                            </div>
                        </div> 
                    </div> 
                </div>           
            </section>
        </div>)
    }
}

