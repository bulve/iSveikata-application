import React ,{Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import LoginForm from '../LoginForm/LoginForm';
import { patientLoggedIn } from './_action/index';

axios.defaults.withCredentials = true;

class PatientLoginContainer extends Component{
    constructor(props){
        super(props);
        this.logoutInfo = JSON.parse(sessionStorage.getItem("401"))
        this.state = {
            patientId:'',
            password:'',

            loginCount:0,
            loginTimer:'',

            infoState:'',

            formErrors: {patientId: '', password: ''},
            fieldState: {patientId: 'is-empty', password: 'is-empty'},
            patientIdValid: false,
            passwordValid: false,    
            formValid: false,
        };
    }

    componentWillMount = () =>{
        if(this.logoutInfo !== null){
          this.setState({
            patientId:this.logoutInfo.patientId,
            patientIdValid:true,
            infoState:(<div className="alert alert-info">
                          <strong>{this.logoutInfo.info}</strong>
                        </div>)
        })
        sessionStorage.setItem("401", null)
        
        }
    }
    
    
    submitHandler = (e) => {

        e.preventDefault();

        if(this.state.formValid && this.state.loginCount < 3){
            this.setState({
                loginCount:this.state.loginCount + 1
              })
            let userData = new URLSearchParams();
            userData.append('userName', this.state.patientId);
            userData.append('password', this.state.password);
            axios.post('http://localhost:8080/api/login', userData, {headers:{'Content-type':'application/x-www-form-urlencoded'}})
            .then((response) => {
                this.props.dispatch(patientLoggedIn(this.state.patientId, response.data.fullName))
                this.props.router.push('/pacientas');
                
            })
            .catch((error) => {
                if(error.response.data.status > 400 && error.response.data.status < 500 ){
                    this.setState({
                        infoState:(<div className="alert alert-danger"><strong>Prisijungti nepavyko. Patikrinkite prisijungimo duomenis ir bandykite dar kartą.</strong></div>)
                    })
                }else{
                    this.setState({
                        infoState:(<div className="alert alert-danger"><strong>Prisijungti nepavyko dėl serverio klaidos, bandykite dar kartą veliau.</strong></div>)
                    })
                }
            })
        }else{
            if(this.state.loginCount > 2){
                clearTimeout(this.loginTimer)
                this.setState({
                  infoState: (<div className="alert alert-info">
                                <strong>Prisijungti nepavyko. Po 15 sekundžių bandykite dar kartą.</strong>
                              </div>)})
                this.loginTimer = setTimeout(()=>
                  this.setState({
                    loginCount:0,
                    infoState:(<div className="alert alert-info">
                                <strong>Galite prisijungti.</strong>
                              </div>)
                  })
                , 15000)
            }else{
                this.setState({
                    infoState:<div className="alert alert-danger"><strong>Prašome taisyklingai užpildyti visus laukus.</strong></div>
                })
            }
        }   
    }
    
    fieldHandler = (e) => {
        // e === event
        const name = e.target.name;
        const value = e.target.value;
    
        switch (name) {
            case 'patientId':
                let patientId = this.state.patientId;
                patientId = value.replace(/[^\d]/g, "");
                this.setState({patientId: patientId});   
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
            case 'password':
                fieldValidationState.password = 'is-empty';
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
                case 'password':
                    fieldValidationErrors.password = '';
                    break;
                default:
                    break;
            }
            this.setState({[nameValid]: false,
                formErrors: fieldValidationErrors
                }, this.validateForm);
        }    
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let fieldValidationState = this.state.fieldState;

        let patientIdValid = this.state.patientIdValid;
        let passwordValid = this.state.passwordValid;
      
        switch (fieldName) {
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
                //Jei įvesties lauko rėmelis žalias - informacija įvesta teisingai, jei raudonas - neteisingai.
                //Čia "is-valid" ir "is-invalid" yra formos elemento id. Spalvinimas aprašytas Form.css faile. 
                break;

            case 'password':
                passwordValid = value.length >= 8;
                // ^ Tikrina ar įrašyta ne mažiau kaip 8 (ir formoje leidžiama įvesti ne daugiau kaip 15 simbolių).
                fieldValidationErrors.password = passwordValid ? '' : 'Slaptažodis per trumpas.';
                fieldValidationState.password = passwordValid ? 'has-success' : 'has-error';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                    fieldState: fieldValidationState,
                    patientIdValid: patientIdValid,
                    passwordValid: passwordValid,
                    }, this.validateForm);
    }

    //Paspausti "submit" leidžiama tik jei visi laukai įvesti teisingai.
    validateForm = () => {
        this.setState({formValid: this.state.patientIdValid && this.state.passwordValid});
    }

    render() {
        return (
            <LoginForm
            classNameLoginValue={this.state.fieldState.patientId}
            classNamePassword={this.state.fieldState.password} 
            errorMessageLoginValue={this.state.formErrors.patientId}
            errorMessagePassword={this.state.formErrors.password}
            infoState={this.state.infoState}
            formValid={this.state.formValid}

            loginValue={this.state.patientId}
            password={this.state.password}

            fieldValidationHandler={this.fieldValidationHandler}
            fieldHandler={this.fieldHandler}
            fieldOnFocusHandler={this.fieldOnFocusHandler}
            submitHandler={this.submitHandler}

            loginPlaceholder={"Asmens kodas"}
            loginValueName={"patientId"}
            />
        )
    }
}


const mapStateToProps = (state) =>{
    return{
        patient:state.patient
    }
}

export default connect(mapStateToProps)(PatientLoginContainer)