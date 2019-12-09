import React, {Component} from 'react';
import axios from 'axios';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { ChangePasswordForm } from './ChangePasswordForm';

export default class UserPasswordContainer extends Component{
    constructor(props){
        super(props);
        this.session =  JSON.parse(sessionStorage.getItem('session'))

        this.state = {
            oldPassword:'',
            newPassword:'',
            newPasswordRepeat:'',

            infoState:'',

            formErrors: {oldPassword: '', newPassword: '', newPasswordRepeat: ''},
            fieldState: {oldPassword: 'is-empty', newPassword: 'is-empty', newPasswordRepeat: 'is-empty'},
            oldPasswordValid: false,
            newPasswordValid: false, 
            newPasswordRepeatValid: false,
            formValid: false,
        };
    }

     componentWillMount = () =>{
        if(this.session.user.loggedIn !== true){
            this.props.router.push('/vartotojams');
            return '';
        }
    }   

    submitHandler = (e) => {

        e.preventDefault();

        if(this.state.formValid){
            axios.put('http://localhost:8080/api/'+this.session.user.userName+'/password', {
                oldPassword:this.state.oldPassword,
                newPassword:this.state.newPassword
            })
            .then((response)=>{
                
                this.setState({
                    infoState:<div className="alert alert-success"><strong>{response.data}</strong></div>
                })
            })
            .catch((erorr) => {
                
                this.setState({
                    infoState:<div className="alert alert-danger"><strong>{erorr.response.data}</strong></div>
                })
            })
        }else{
            this.setState({
                infoState:<div className="alert alert-danger"><strong>Prašome taisyklingai užpildyti visus laukus.</strong></div>
            })
        }
    }

    disableActions = (e) => {
        // e === event
        e.preventDefault();
    }

    fieldHandler = (e) => {
        // e === event
        const name = e.target.name;
        const value = e.target.value;

        //if(name === 'newPassword' && this.state.newPasswordRepeat.length !== 0 && this.state.newPasswordRepeat !== value) {
            //this.setState({newPassword: value, newPasswordRepeat: ''});
        //} else {
            this.setState({[name]: value});
        //}

    }

    fieldOnFocusHandler = (e) => {
        // e === event
        const name = e.target.name;
 
        let fieldValidationState = this.state.fieldState;
      
        switch (name) {
            case 'oldPassword':
                fieldValidationState.oldPassword = 'is-empty';
                break;
            case 'newPassword':
                fieldValidationState.newPassword = 'is-empty';
                break;
            case 'newPasswordRepeat':
                fieldValidationState.newPasswordRepeat = 'is-empty';
                break;
            default:
                break;
        }
        this.setState({fieldState: fieldValidationState, infoState: ''});
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
            let fieldValidationState = this.state.fieldState;
            let newPasswordRepeat = this.state.newPasswordRepeat;
            switch (name) {
                case 'oldPassword':
                    fieldValidationErrors.oldPassword = '';
                    break;
                case 'newPassword':
                    fieldValidationErrors.newPassword = '';
                    fieldValidationErrors.newPasswordRepeat = '';
                    fieldValidationState.newPasswordRepeat = 'is-empty';
                    newPasswordRepeat = '';
                    break;
                case 'newPasswordRepeat':
                    fieldValidationErrors.newPasswordRepeat = '';
                    break;
                default:
                    break;
            }
            this.setState({[nameValid]: false,
                formErrors: fieldValidationErrors,
                fieldState: fieldValidationState,
                newPasswordRepeat:newPasswordRepeat
                }, this.validateForm);
        }    
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let fieldValidationState = this.state.fieldState;
        let oldPasswordValid = this.state.oldPasswordValid;
        let newPasswordValid = this.state.newPasswordValid;
        let newPasswordRepeatValid = this.state.newPasswordRepeatValid;
      
        switch (fieldName) {
            case 'oldPassword':
                oldPasswordValid = (value.length >= 8) || (value === "123");
                // ^ Tikrina ar įrašyta ne mažiau kaip 8 (ir formoje leidžiama įvesti ne daugiau kaip 15 simbolių). Išimtis: administratoriaus slaptažodis.
                fieldValidationErrors.oldPassword = oldPasswordValid ? '' : 'Įvestas slaptažodis per trumpas.';
                fieldValidationState.oldPassword = oldPasswordValid ? 'has-success' : 'has-error';
                //Jei įvesties lauko rėmelis žalias - informacija įvesta teisingai, jei raudonas - neteisingai.
                //Čia "has-success" / "has-error" yra viena iš formos elemento klasių. 
                break;
            case 'newPassword':
                if(value.length >= 8) { 
                    if(value !== this.state.oldPassword) {
                        newPasswordValid = true;
                        fieldValidationErrors.newPassword = '';
                    } else {
                        newPasswordValid = false;
                        fieldValidationErrors.newPassword = 'Naujas slaptažodis sutampa su senuoju.'; 
                    }
                } else {
                    newPasswordValid = false;
                    fieldValidationErrors.newPassword = 'Naujas slaptažodis per trumpas.';
                }

                fieldValidationState.newPassword = newPasswordValid ? 'has-success' : 'has-error';

                newPasswordRepeatValid = value === this.state.newPasswordRepeat ? true : false; 
                // ^ Tikrina ar naujas slaptažodis sutampa su žemiau įvestu pakartotu slaptažodžiu (jeigu naujas slaptažodis redaguojamas, kai žemiau jau įvestas pakartojimas).
                fieldValidationErrors.newPasswordRepeat = newPasswordRepeatValid ? '' : (this.state.newPasswordRepeat.length === 0 ? '' : 'Slaptažodžiai nesutampa!');
                fieldValidationState.newPasswordRepeat = newPasswordRepeatValid ? 'has-success' : (this.state.newPasswordRepeat.length === 0 ? 'is-empty' : 'has-error');   
                break;
            case 'newPasswordRepeat':
                newPasswordRepeatValid = value === this.state.newPassword;
                // ^ Tikrina ar pakartotas slaptažodis sutampa su aukščiau įvestu nauju slaptažodžiu.
                fieldValidationErrors.newPasswordRepeat = newPasswordRepeatValid ? '' : 'Naujasis slaptažodis pakartotas neteisingai!';
                fieldValidationState.newPasswordRepeat = newPasswordRepeatValid ? 'has-success' : 'has-error';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                    fieldState: fieldValidationState,
                    oldPasswordValid: oldPasswordValid,
                    newPasswordValid: newPasswordValid,
                    newPasswordRepeatValid: newPasswordRepeatValid
                    }, this.validateForm);
    }

    //Jei bent vienas laukas neįvestas teisingai, paspaudus "submit" pasirodo perspėjimas.
    validateForm = () => {
        this.setState({formValid: this.state.oldPasswordValid && this.state.newPasswordValid && this.state.newPasswordRepeatValid});
    }

    render(){
        return( 
            <div className='container'>
                <section>     
                <UserDetailsComponent  fullName={this.session.user.fullName} other={
                    <li className="navbar-text">
                    <button onClick={() =>  this.props.router.goBack()} className="btn btn-default"> Atgal </button>
                    </li>
                }/>
                    <ChangePasswordForm
                    classNameOldPassword={this.state.fieldState.oldPassword}
                    classNameNewPassword={this.state.fieldState.newPassword}
                    classNameNewPasswordRepeat={this.state.fieldState.newPasswordRepeat}
                    errorMessageOldPassword={this.state.formErrors.oldPassword}
                    errorMessageNewPassword={this.state.formErrors.newPassword}
                    errorMessageNewPasswordRepeat={this.state.formErrors.newPasswordRepeat}
                    infoState={this.state.infoState}

                    oldPassword={this.state.oldPassword}
                    newPassword={this.state.newPassword}
                    newPasswordRepeat={this.state.newPasswordRepeat}

                    fieldValidationHandler={this.fieldValidationHandler}
                    fieldHandler={this.fieldHandler}
                    fieldOnFocusHandler={this.fieldOnFocusHandler}
                    disableActions={this.disableActions}
                    submitHandler={this.submitHandler} />
                </section>
            </div>
        )
    }
}


              