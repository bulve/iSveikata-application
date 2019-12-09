import React, {Component} from 'react';
import axios from 'axios';

import PatientForm from '../AdminComponent/PatientForm';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

export default class AdminCreatePatientContainer extends Component{
    constructor(props){
        super(props);
        this.session =  JSON.parse(sessionStorage.getItem('session'))
        this.state = {
            patientId:'',
            firstName:'',
            lastName:'',

            infoState:'',

            formErrors: {patientId: '', firstName: '', lastName: ''},
            fieldState: {patientId: 'is-empty', firstName: 'is-empty', lastName: 'is-empty'},
            patientIdValid: false, 
            firstNameValid: false,
            lastNameValid: false,
                             
            formValid: false,

            passwordMasked: true,
            generatedNumber: (Math.floor(Math.random() * (99 - 10 +1)) + 10).toString()   
        };
    }

    componentWillMount = () => {
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'admin'){
            this.props.router.push('/vartotojams');
            return '';
        }  
    } 

    submitHandler = (e) => {

        e.preventDefault();

        if(this.state.formValid){
            axios.post('http://localhost:8080/api/admin/new/patient', {
                patientId:this.state.patientId,
                birthDate:this.generateBirthDate(),  
                firstName:this.state.firstName,  
                lastName:this.state.lastName,    
                password:this.generatePassword()   
            })
            .then((response)=>{
                this.setState({
                    infoState:<div className="alert alert-success"><strong>Naujo paciento paskyra sėkmingai sukurta.</strong></div>,

                    patientId:'',
                    firstName:'',
                    lastName:'',

                    formErrors: {patientId: '', firstName: '', lastName: ''},
                    fieldState: {patientId: 'is-empty', firstName: 'is-empty', lastName: 'is-empty'},
                    patientIdValid: false, 
                    firstNameValid: false,
                    lastNameValid: false,                                    
                    formValid: false,

                    passwordMasked: true,
                    generatedNumber: (Math.floor(Math.random() * (99 - 10 +1)) + 10).toString()                      
                })
            })
            .catch((error) => {             
                if(error.response.data.status > 400 && error.response.data.status < 500){
                    UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                    this.props.router.push("/atsijungti")
                }else if(error.response.status === 422){
                    this.setState({
                        infoState:(<h3>{error.response.data}</h3>)
                    })
                }else{
                    this.setState({
                        infoState:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
                    })
                }
            })
        }else{
            this.setState({
                infoState:<div className="alert alert-danger"><strong>Prašome taisyklingai užpildyti visus laukus.</strong></div>
            })
        }
    }

    fieldHandler = (e) => {
        // e === event
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'patientId':
                let patientId = this.state.patientId;
                patientId = value.replace(/\D/g, "");
                this.setState({patientId: patientId});   
                break;
            case 'firstName':
                let firstName = this.state.firstName;
                firstName = value.replace(/[^a-z ąčęėįšųūž]/gi, "");
                this.setState({firstName: firstName});   
                break; 
            case 'lastName':
                let lastName = this.state.lastName;
                lastName = value.replace(/[^a-z ąčęėįšųūž-]/gi, "");
                this.setState({lastName: lastName});   
                break;   
            default:
                this.setState({[name]: value});  
                break;
        }
    }

    fieldOnFocusHandler = (e) => {
        // e === event
        const name = e.target.name;
    
        let fieldValidationState = this.state.fieldState;
      
        switch (name) {
            case 'patientId':
                fieldValidationState.patientId = 'is-empty';
                break;
            case 'firstName':
                fieldValidationState.firstName = 'is-empty';
                break;
            case 'lastName':
                fieldValidationState.lastName = 'is-empty';
                break;
            default:
                break;
        }
        this.setState({fieldState: fieldValidationState, infoState: '', formValid: false});
    }

    fieldValidationHandler = (e) => {
        // e === event
        const name = e.target.name;
        const value = e.target.value;
      
        if(value.length !== 0) {
    
            this.validateField(name, value);
        } else {
            let nameValid = name + 'Valid';
        
            let fieldValidationErrors = this.state.formErrors;
            switch (name) {
                case 'patientId':
                    fieldValidationErrors.patientId = '';
                    break;
                case 'firstName':
                    fieldValidationErrors.firstName = '';
                    break;
                case 'lastName':
                    fieldValidationErrors.lastName = '';
                    break;
                default:
                    break;
            }
            this.setState({[nameValid]: false,
                formErrors: fieldValidationErrors
                }, this.validateForm);
        }    
    }

    capitalizeFirstLetter = (string) => { 
        return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    //Pagal įvestą asmens kodą sužinoma gimimo data. 
    generateBirthDate = () => {
        let birthDateAutoInput = '';
          
        if(this.state.patientIdValid) {
            let patientIdAsString = this.state.patientId.toString();
    
            let birthYearLastdigitsAsString = patientIdAsString.substring(1, 3);
            let birthMonthAsString = patientIdAsString.substring(3, 5); 
            let birthDayAsString = patientIdAsString.substring(5, 7);
            
            if(patientIdAsString.charAt(0) === "3" || patientIdAsString.charAt(0) === "4") {
                birthDateAutoInput = "19" + birthYearLastdigitsAsString + "-" + birthMonthAsString + "-" + birthDayAsString;
            } 
          //else if(patientIdAsString.charAt(0) === "1" || patientIdAsString.charAt(0) === "2") {
          //    birthDateAutoInput = "18" + birthYearLastdigitsAsString + "-" + birthMonthAsString + "-" + birthDayAsString;
          //} 
            else {
                birthDateAutoInput = "20" + birthYearLastdigitsAsString + "-" + birthMonthAsString + "-" + birthDayAsString;
            } 
        }
        return birthDateAutoInput;  
    }

    //Slaptažodis sudaromas iš trijų pirmų vardo raidžių, trijų pirmų pavardės raidžių ir atsitiktinio dviženklio skaičiaus. 
    generatePassword = () => {
        let generatedPassword = ''; 
        if(this.state.firstNameValid && this.state.lastNameValid) {
            generatedPassword = this.state.firstName.substring(0, 3) + this.state.lastName.substring(0, 3) + this.state.generatedNumber;    
        }
        return generatedPassword;
    }

     //Paspaudus ant slaptažodžio įvesties langelio (read only), galima pamatyti slaptažodį; vėl paspaudus - paslėpti.
     handlePasswordMasking = () => {
        this.setState(prevState => ({passwordMasked: !prevState.passwordMasked}));
    }
     //Formos laukų validacija:
     validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let fieldValidationState = this.state.fieldState;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let patientIdValid = this.state.patientIdValid;

        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
      
        switch (fieldName) {
            case 'firstName':
                firstName = this.capitalizeFirstLetter(value.trim());
                firstNameValid = firstName.match(/^[a-ząčęėįšųūž]{3,}( [a-ząčęėįšųūž]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės ir ne mažiau kaip trys. Tarp žodžių leidžiamas vienas tarpas.
                //Vėliau su XRegExp galima būtų padaryti kad atpažintų ir kitų kalbų raides;
                fieldValidationErrors.firstName = firstNameValid ? '' : 'Įveskite vardą.';
                fieldValidationState.firstName = firstNameValid ? 'has-success' : 'has-error';
                //Jei įvesties lauko rėmelis žalias - informacija įvesta teisingai, jei raudonas - neteisingai.
                //Čia "has-success" ir "is-invalid" yra viena iš formos elemento klasių. 
                break;
            case 'lastName':
                lastName = this.capitalizeFirstLetter(value.trim());
                lastNameValid = lastName.match(/^[a-ząčęėįšųūž]{3,}(-[a-ząčęėįšųūž]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės ir ne mažiau kaip trys. Tarp žodžių leidžiamas vienas tarpas.
                fieldValidationErrors.lastName = lastNameValid ? '' : 'Įveskite pavardę.';
                fieldValidationState.lastName = lastNameValid ? 'has-success' : 'has-error';
                break;
            case 'patientId':
            //Patikrinama ar įrašyta 11 skaitmenų.
                if(value.length === 11) {

                    //Patikrinamas AK: 
                    //    įrašyti tik skaitmenys;
                    //    pirmas skaičius gali būti tik 3, 4, 5 arba 6;
                    //    ketvirtas ir penktas - 00-12; 
                    //    šeštas ir septintas - 00-31;
                    //    jei Ketvirtas ir penktas - 02, tai šeštas ir septintas - 00-29.
                    //Pastaba: jei asmuo neprisimena savo gimimo mėnesio ar dienos, tokiuose koduose vietoje mėnesio ar dienos skaitmenų įrašomi 0. Tai labai reta išimtis.
                    if(value.match(/^([3-6]{1})([0-9]{2})(((([0]{1})([013-9]{1})|([1]{1})([0-2]{1}))(([0-2]{1})([0-9]{1})|([3]{1})([0-1]{1})))|(([0]{1})([2]{1})([0-2]{1})([0-9]{1})))([0-9]{4})$/g)) {

                        let patientIdAsString = value.toString();

                        let birthYearFirstdigits = patientIdAsString.charAt(0) === "3" || patientIdAsString.charAt(0) === "4" ? 1900 : 2000;
                        let birthYearLastdigits = parseInt(patientIdAsString.substring(1, 3), 10);

                        let birthYear = birthYearFirstdigits + birthYearLastdigits;
                        let birthMonth = parseInt(patientIdAsString.substring(3, 5), 10); 
                        let birthDay = parseInt(patientIdAsString.substring(5, 7), 10);

                        let currentDate = new Date();
                        let birthDate = new Date();
                        birthDate.setFullYear(birthYear, birthMonth-1, birthDay);

                        //Patikrinama, ar gimimo data "ne ateityje". 
                        if(birthDate < currentDate) {

                            //Patikrinama, ar gimimo metai keliamieji.
                            if(birthYear % 400 === 0 || (birthYear % 100 !== 0 && birthYear % 4 === 0)) {
                                patientIdValid = true;
                                fieldValidationErrors.patientId = '';
                            //Jei gimimo metai ne keliamieji - tikrinama ar ketvirtas-septintas skaitmenys nėra 0229 (tokiais metais vasaris turi tik 28 dienas).
                            } else if(birthMonth === 2 && birthDay === 29) {
                                patientIdValid = false;
                                fieldValidationErrors.patientId = 'Patikrinkite ar gerai įvedėte 4-7 skaitmenis.';
                            } else {
                                patientIdValid = true;
                                fieldValidationErrors.patientId = '';  
                            }
                            
                        } else {
                            patientIdValid = false;
                            fieldValidationErrors.patientId = 'Patikrinkite ar gerai įvedėte pirmą skaitmenį. Jei taip - tikrinkite 2-7 skaitmenis.';
                        }

                    } else {
                        patientIdValid = false;
                        fieldValidationErrors.patientId = 'Patikrinkite ar gerai įvedėte 1-7 skaitmenis.'; 
                    }

                } else {
                    patientIdValid = false;
                    fieldValidationErrors.patientId = 'Įveskite 11 skaitmenų asmens kodą.';
                }

                fieldValidationState.patientId = patientIdValid ? 'has-success' : 'has-error';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        fieldState: fieldValidationState,
                        firstName: firstName,
                        lastName: lastName,
                        firstNameValid: firstNameValid,
                        lastNameValid: lastNameValid,
                        patientIdValid: patientIdValid
                      }, this.validateForm);
    }

    //Paspausti "submit" leidžiama tik jei visi laukai įvesti teisingai.
    validateForm = () => {
        this.setState({formValid: 
            this.state.firstNameValid && 
            this.state.lastNameValid && 
            this.state.patientIdValid});
    }
      
    render(){
        return(
            <div className="container">
               
                <section>     
                <UserDetailsComponent fullName={this.session.user.fullName} other={
            <li className="navbar-text">
            <button onClick={() =>  this.props.router.goBack()} className="btn btn-default"> Atgal </button>
            </li>
            } />
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3>Naujo paciento registravimo forma</h3>
                        </div>
                        <div className="panel-body">
                            <PatientForm
                            classNamePatientId={this.state.fieldState.patientId}
                            classNameFirstName={this.state.fieldState.firstName}
                            classNameLastName={this.state.fieldState.lastName}
                            errorMessagePatientId={this.state.formErrors.patientId}
                            errorMessageFirstName={this.state.formErrors.firstName}
                            errorMessageLastName={this.state.formErrors.lastName}
                            infoState={this.state.infoState}
                            formValid={this.state.formValid}

                            patientId={this.state.patientId}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            
                            generateBirthDate={this.generateBirthDate()}
                            generatePassword={this.generatePassword()}

                            passwordMasked={this.state.passwordMasked}
                            handlePasswordMasking={this.handlePasswordMasking}

                            fieldValidationHandler={this.fieldValidationHandler}
                            fieldHandler={this.fieldHandler}
                            fieldOnFocusHandler={this.fieldOnFocusHandler}
                            submitHandler={this.submitHandler} />
                        </div> 
                    </div>        
                </section>
            </div>
        );
    }
}


