import React, {Component} from 'react';
import axios from 'axios';

import UsersForm from '../AdminComponent/UsersForm';
import { UserFormSpecInput } from '../AdminComponent/UserFormSpecInput';
import { UserFormSpecOtherInput } from '../AdminComponent/UserFormSpecOtherInput';
import { UserFormDrugStoreInput } from '../AdminComponent/UserFormDrugStoreInput';
import { UserDetailsComponent } from '../AdminComponent/UserDetailsComponent';
import { UnauthorizedComponent } from '../UnauthorizedComponent';

export default class AdminCreateUserContainer extends Component{
    constructor(props){
        super(props);
        this.session =  JSON.parse(sessionStorage.getItem('session'));
        this.state = {
            type: 'admin',

            firstName: '',
            lastName: '',
            password: Math.random().toString(36).substr(2,8), //slaptažodis generuojamas iš 8 atsitiktinių skaitmenų ir raidžių.
            
            specializations: '',
            specialization: '',
            title: 'select',
            newTitle: '',

            companyType: 'select',
            companyName: '',

            infoState: '',

            formErrors: {firstName: '', lastName: '', newTitle: '', companyName: ''},
            fieldState: {firstName: 'is-empty', lastName: 'is-empty', newTitle: 'is-empty', companyName: 'is-empty'},
            firstNameValid: false,
            lastNameValid: false,
            newTitleValid: false,    
            companyNameValid: false, 

            titleValid: false,
            companyTypeValid: false,

            formValid: false,

            passwordMasked: true,
            generatedNumericString: Math.random().toString().substr(2,3)
        };
    }

    componentWillMount = () =>{
        if(this.session === null || this.session.user.loggedIn !== true || this.session.user.userType !== 'admin'){
            this.props.router.push('/vartotojams');
            return '';
        }
        this.getAllSpecialization();
    } 

    specializationInput = () =>{
        if(this.state.type === 'doctor'){
            return (<UserFormSpecInput 
                specializations={this.state.specializations}

                title={this.state.title}
                
                fieldHandler={this.fieldHandler}
                selectOnFocusHandler={this.selectOnFocusHandler}

                otherSpecialization={
                    this.state.title === 'kita' ? 
                    <UserFormSpecOtherInput
                    classNameNewTitle={this.state.fieldState.newTitle}
                    errorMessageNewTitle={this.state.formErrors.newTitle}
                
                    newTitle={this.state.newTitle}

                    fieldValidationHandler={this.fieldValidationHandler}
                    fieldHandler={this.fieldHandler}
                    fieldOnFocusHandler={this.fieldOnFocusHandler}      
                    /> : null
                } />
            )
        }else{
            return null;
        }
    }

    drugStoreInput = () =>{
        if(this.state.type === 'druggist'){
            return (<UserFormDrugStoreInput 
                classNameCompanyName={this.state.fieldState.companyName}
                errorMessageCompanyName={this.state.formErrors.companyName}

                companyType={this.state.companyType}
                companyName={this.state.companyName}

                fieldValidationHandler={this.fieldValidationHandler}
                fieldHandler={this.fieldHandler}
                fieldOnFocusHandler={this.fieldOnFocusHandler}
                selectOnFocusHandler={this.selectOnFocusHandler}
            />)
        }else{
            return null;
        }
    }

    submitHandler = (e) =>{
        
        e.preventDefault();

        if(this.state.formValid){

            axios.post('http://localhost:8080/api/admin/new/user', {
                employee:this.userObjectByType() ,
                specialization:this.state.type === "doctor" ? this.state.specialization : null
            })
            .then((response)=>{
                this.setState({
                    infoState:<div className="alert alert-success"><strong>Naujo vartotojo paskyra sėkmingai sukurta.</strong></div>,
                    
                    firstName: '',
                    lastName: '',
                    password: Math.random().toString(36).substr(2,8), //slaptažodis generuojamas iš 8 atsitiktinių skaitmenų ir raidžių.
                    
                    specialization: '',
                    title: 'select',
                    newTitle: '',

                    companyType: 'select',
                    companyName: '',

                    formErrors: {firstName: '', lastName: '', newTitle: '', companyName: ''},
                    fieldState: {firstName: 'is-empty', lastName: 'is-empty', newTitle: 'is-empty', companyName: 'is-empty'},
                    firstNameValid: false,
                    lastNameValid: false,
                    newTitleValid: false,    
                    companyNameValid: false, 

                    titleValid: false,
                    companyTypeValid: false,

                    formValid: false,

                    passwordMasked: true,
                    generatedNumericString: Math.random().toString().substr(2,3)  
                })
                this.getAllSpecialization()
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

    userObjectByType = () =>{
        if(this.state.type === "druggist"){
            return{ firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    userName:this.generateUsername(),
                    password:this.state.password,
                    drugStore:this.fullCompanyName(),
                    type:this.state.type}
        }else if(this.state.type === "doctor"){
            return{ firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    userName:this.generateUsername(),
                    password:this.state.password,
                    type:this.state.type,}
        }else{
            return{ firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    userName:this.generateUsername(),
                    password:this.state.password,
                    type:this.state.type,}
        }
    }

    getAllSpecialization = () =>{
        axios.get('http://localhost:8080/api/specialization')
        .then((response)=>{
            this.setState({
                specializations: response.data.map(this.composerSpecialization)
            })
        })
        .catch((error) => {
            if(error.response.data.status > 400 && error.response.data.status < 500){
                UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
                this.props.router.push("/atsijungti")
            }else{
                this.setState({
                    infoState:(<h3>Serverio klaida. Nepavyko gauti specializacijų sąrašo.</h3>)
                })
            }
        })
    } 

    composerSpecialization = (spec, index) =>{
        return(
            <option key={index} value={spec.title}>{spec.title}</option>
        )
    }

    setSpecialization = () => {
        let title = this.state.title;
        let newTitle = this.state.newTitle;
        let newTitleValid = this.state.newTitleValid;
        let fieldValidationErrors = this.state.formErrors;
        let fieldValidationState = this.state.fieldState;

        if(title !== 'kita' && title !== 'select'){
            fieldValidationErrors.newTitle = '';
            fieldValidationState.newTitle = 'is-empty';
            this.setState({specialization: title, newTitle: '', newTitleValid: false, fieldState: fieldValidationState, formErrors: fieldValidationErrors}, this.validateForm);
        }else if(title === 'kita' && newTitleValid){
            this.setState({specialization: newTitle}, this.validateForm);
        }else if(title === 'select'){
            fieldValidationErrors.newTitle = '';
            fieldValidationState.newTitle = 'is-empty';
            this.setState({specialization: '', newTitle: '', newTitleValid: false, fieldState: fieldValidationState, formErrors: fieldValidationErrors}, this.validateForm);
        }else{
            this.setState({specialization: ''}, this.validateForm);
        }
    }

    fullCompanyName = () => {
        return this.state.companyType + " " + this.state.companyName;
    }

    //Užtikrina, kad vardas ir pavardė būtų iš didžiosios raidės, jei įvesta mažosiomis.
    capitalizeFirstLetter = (string) => { 
        return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

     //Užtikrina, kad darbovietės pavadinimas būtų iš didžiosios raidės, jei įvesta mažosiomis.
     capitalizeFirstLetterOfString(string) { 
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
    //Slapyvardis sudaromas iš trijų pirmų vardo raidžių, trijų pirmų pavardės raidžių ir atsitiktinio triženklio skaičiaus. 
    generateUsername = () => {
        let generatedUserName = ''; 
        if(this.state.firstNameValid && this.state.lastNameValid) {
            generatedUserName = this.state.firstName.substring(0, 3) + this.state.lastName.substring(0, 3) + this.state.generatedNumericString;    
        }
        return generatedUserName;
    }
    
    //Paspaudus ant slaptažodžio įvesties langelio (read only), galima pamatyti slaptažodį; vėl paspaudus - paslėpti.
    handlePasswordMasking = () => {
        this.setState(prevState => ({passwordMasked: !prevState.passwordMasked}));
    }

    resetHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value,
     
                    firstName: '',
                    lastName: '',
                    password: Math.random().toString(36).substr(2,8), //slaptažodis generuojamas iš 8 atsitiktinių skaitmenų ir raidžių.
                    
                    specialization: '',
                    title: 'select',
                    newTitle: '',

                    companyType: 'select',
                    companyName: '',

                    infoState: '',

                    formErrors: {firstName: '', lastName: '', newTitle: '', companyName: ''},
                    fieldState: {firstName: 'is-empty', lastName: 'is-empty', newTitle: 'is-empty', companyName: 'is-empty'},
                    firstNameValid: false,
                    lastNameValid: false,
                    newTitleValid: false,    
                    companyNameValid: false, 

                    titleValid: false,
                    companyTypeValid: false,

                    formValid: false,

                    passwordMasked: true,
                    generatedNumericString: Math.random().toString().substr(2,3)  
        });            
    }

    fieldHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'title':
                let titleValid = this.state.titleValid;
                titleValid = value === "select" ? false : true;
                this.setState({title: value,
                            titleValid: titleValid}, this.setSpecialization);   
                break;
            case 'companyType':
                let companyTypeValid = this.state.companyTypeValid;
                companyTypeValid = value === "select" ? false : true;
                this.setState({companyType: value,
                            companyTypeValid: companyTypeValid}, this.validateForm);   
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
            case 'newTitle':
                let newTitle = this.state.newTitle;
                newTitle = value.replace(/[^a-z ąčęėįšųūž]/gi, "");
                this.setState({newTitle: newTitle});   
                break; 
            case 'companyName':
                let companyName = this.state.companyName;
                companyName = value.replace(/[^a-z ąčęėįšųūž\d-]/gi, "");
                this.setState({companyName: companyName});   
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
            case 'firstName':
                fieldValidationState.firstName = 'is-empty';
                break;
            case 'lastName':
                fieldValidationState.lastName = 'is-empty';
                break;
            case 'newTitle':
                fieldValidationState.newTitle = 'is-empty';
                break;
            case 'companyName':
                fieldValidationState.companyName = 'is-empty';
                break;
            default:
                break;
        }
        this.setState({fieldState: fieldValidationState, infoState: '', formValid: false});
    }
    
    selectOnFocusHandler = (e) => {
        // e === event
        this.setState({infoState: ''});
    }

    fieldValidationHandler = (e) => {
        // e === event
        const name = e.target.name;
        const value = e.target.value;
    
        if(value.length !== 0) {
            
            this.validateField(name, value);
        
        } else {
            let fieldValidationErrors = this.state.formErrors;
            switch (name) {
                case 'firstName':
                    fieldValidationErrors.firstName = '';
                    this.setState({firstNameValid: false, formErrors: fieldValidationErrors}, this.validateForm);
                    break;
                case 'lastName':
                    fieldValidationErrors.lastName = '';
                    this.setState({lastNameValid: false, formErrors: fieldValidationErrors}, this.validateForm);
                    break;
                case 'newTitle':
                    fieldValidationErrors.newTitle = '';
                    this.setState({newTitleValid: false, formErrors: fieldValidationErrors}, this.setSpecialization);
                    break;
                case 'companyName':
                    fieldValidationErrors.companyName = '';
                    this.setState({companyNameValid: false, formErrors: fieldValidationErrors}, this.validateForm);
                    break;
                default:
                    break;
            }
        }    
    }
    
    //Formos laukų validacija:
    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let fieldValidationState = this.state.fieldState;

        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let newTitleValid = this.state.newTitleValid;
        let companyNameValid = this.state.companyNameValid;

        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let newTitle = this.state.newTitle;
        let companyName = this.state.companyName;
      
        switch (fieldName) {
            case 'firstName':
                firstName = this.capitalizeFirstLetter(value.trim());
                firstNameValid = firstName.match(/^[a-ząčęėįšųūž]{3,}( [a-ząčęėįšųūž]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės ir ne mažiau kaip trys. Tarp žodžių leidžiamas vienas tarpas.
                //Vėliau su XRegExp galima būtų padaryti kad atpažintų ir kitų kalbų raides;
                fieldValidationErrors.firstName = firstNameValid ? '' : 'Įveskite vardą.';
                fieldValidationState.firstName = firstNameValid ? 'has-success' : 'has-error';
                //Jei įvesties lauko rėmelis žalias - informacija įvesta teisingai, jei raudonas - neteisingai.
                //Čia "is-valid" ir "is-invalid" yra formos elemento id. Spalvinimas aprašytas Form.css faile.
                this.setState({formErrors: fieldValidationErrors,
                            fieldState: fieldValidationState,
                            firstName: firstName,
                            firstNameValid: firstNameValid,
                        }, this.validateForm); 
                break;
            case 'lastName':
                lastName = this.capitalizeFirstLetter(value.trim());
                lastNameValid = lastName.match(/^[a-ząčęėįšųūž]{3,}(-[a-ząčęėįšųūž]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės ir ne mažiau kaip trys. Tarp žodžių leidžiamas vienas tarpas.
                fieldValidationErrors.lastName = lastNameValid ? '' : 'Įveskite pavardę.';
                fieldValidationState.lastName = lastNameValid ? 'has-success' : 'has-error';
                this.setState({formErrors: fieldValidationErrors,
                            fieldState: fieldValidationState,
                            lastName: lastName,
                            lastNameValid: lastNameValid,
                        }, this.validateForm);
                break;
            case 'newTitle':
                newTitle = this.capitalizeFirstLetter(value.trim());
                newTitleValid = newTitle.match(/^[a-ząčęėįšųūž]{3,}( [a-ząčęėįšųūž]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės ir ne mažiau kaip trys. Tarp žodžių leidžiamas vienas tarpas.
                fieldValidationErrors.newTitle = newTitleValid ? '' : 'Įveskite specializaciją.';
                fieldValidationState.newTitle = newTitleValid ? 'has-success' : 'has-error';
                this.setState({formErrors: fieldValidationErrors,
                            fieldState: fieldValidationState,
                            newTitle: newTitle,
                            newTitleValid: newTitleValid,  
                        }, this.setSpecialization);
                break;
            case 'companyName':
                companyName = this.capitalizeFirstLetterOfString(value.trim());
                companyNameValid = companyName.match(/^[a-ząčęėįšųūž\d]{1,}([ -]{1}[a-ząčęėįšųūž\d]+)*$/gi);
                // ^ Tikrina ar įrašytos tik raidės bei skaičiai ir ne mažiau kaip viena(s). Tarp žodžių leidžiamas vienas tarpas.
                fieldValidationErrors.companyName = companyNameValid ? '' : 'Įveskite darbovietės pavadinimą.';
                fieldValidationState.companyName = companyNameValid ? 'has-success' : 'has-error';
                this.setState({formErrors: fieldValidationErrors,
                            fieldState: fieldValidationState,
                            companyName: companyName,
                            companyNameValid: companyNameValid
                        }, this.validateForm);
                break;
            default:
                break;
        }
    }
    
    //Paspausti "submit" leidžiama tik jei visi laukai įvesti teisingai.
    validateForm = () => {
        if(this.state.type === 'doctor'){
        this.setState({formValid: this.state.firstNameValid && this.state.lastNameValid && this.state.specialization !== ''});
        }else if (this.state.type === 'druggist'){
            this.setState({formValid: this.state.firstNameValid && this.state.lastNameValid && this.state.companyNameValid && this.state.companyTypeValid});
        }else{
            this.setState({formValid: this.state.firstNameValid && this.state.lastNameValid});
        }
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
                            <h3>Naujo sistemos vartotojo registravimo forma</h3>
                        </div>
                        <div className="panel-body">
                            <UsersForm
                            classNameFirstName={this.state.fieldState.firstName}
                            classNameLastName={this.state.fieldState.lastName}
                            errorMessageFirstName={this.state.formErrors.firstName}
                            errorMessageLastName={this.state.formErrors.lastName}
                            infoState={this.state.infoState}
                            formValid={this.state.formValid}

                            type={this.state.type}
                            
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            
                            userName={ this.generateUsername()} 
                            password={this.state.password}
                        
                            passwordMasked={this.state.passwordMasked}
                            handlePasswordMasking={this.handlePasswordMasking}

                            specializationInput={this.specializationInput()}
                            drugStoreInput={this.drugStoreInput()}

                            fieldValidationHandler={this.fieldValidationHandler}
                            fieldHandler={this.fieldHandler}
                            fieldOnFocusHandler={this.fieldOnFocusHandler}
                            resetHandler={this.resetHandler}
                            submitHandler={this.submitHandler} />
                        </div> 
                    </div>        
                </section>
            </div>
        );
    }
}

