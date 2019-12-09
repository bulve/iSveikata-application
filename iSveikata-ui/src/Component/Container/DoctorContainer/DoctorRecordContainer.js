import React, { Component } from "react";
import axios from "axios";

import PatientInfoCard from "../DoctorComponent/PatientInfoCard";
import RecordForm from "../DoctorComponent/RecordForm";
import { UserDetailsComponent } from "../AdminComponent/UserDetailsComponent";
import { UnauthorizedComponent } from "../UnauthorizedComponent";

export default class DoctorRecordContainer extends Component{
  constructor(props){
    super(props);
    this.patientInfo = JSON.parse(sessionStorage.getItem('patientInfo'))
    this.session = JSON.parse(sessionStorage.getItem("session"));
    this.state = {
      patient: "",
      icds: "",

      userName: this.session.user.userName,

      infoState: "",

      icdCode: "select",
      description: "",
      isCompensable: false,
      isRepetitive: false,
      duration: "",
      
      formErrors: {description: "", duration: ""},
      fieldState: {description: "is-empty", duration: "is-empty"},
      descriptionValid: false,
      durationValid: false,

      icdCodeValid: false,
      
      formValid: false,

      minutes: 0
    };
  };

  timerTick() {
    this.setState(prevState => ({
      minutes: prevState.minutes + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.timerTick(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillMount = () => {
    if (
      this.session === null ||
      this.session.user.loggedIn !== true ||
      this.session.user.userType !== "doctor"
    ) {
      this.props.router.push("/vartotojams");
      return "";
    }
    this.loadPatient();
    this.loadIcd();
  }; 

  loadIcd = () => {
    this.setState({
      icds: this.session.doctor.icdList.map((icd, index) => (
        <option key={index} value={icd.icdCode}>
          {icd.icdCode} - {icd.title}
        </option>
      ))
    })
  };

  loadPatient = () => {
    this.setState({
          patient: this.patientInfo
    });

  }; 

  submitHandler = (e) => {
    let date = new Date();
    let currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    
    e.preventDefault();
    

    if(this.state.formValid){
      console.log({
        appointment: {
          duration: this.state.duration,
          description: this.state.description,
          date: currentDate
        },
        medicalRecord: {
          compensable: this.state.isCompensable,
          repetitive: this.state.isRepetitive
        },
        icdCode: this.state.icdCode,
        patientId: this.state.patient.id,
        userName: this.state.userName
      })
      axios
        .post("http://localhost:8080/api/doctor/new/record", {
          appointment: {
            duration: this.state.duration,
            description: this.state.description,
            date: currentDate
          },
          medicalRecord: {
            compensable: this.state.isCompensable,
            repetitive: this.state.isRepetitive
          },
          icdCode: this.state.icdCode,
          patientId: this.state.patient.id,
          userName: this.state.userName
        })
        .then(response => {
          
          this.setState({
            infoState:<div className="alert alert-success"><strong>Naujas įrašas sėkmingai sukurtas.</strong></div>,
            
            icdCode: "select",
            description: "",
            isCompensable: false,
            isRepetitive: false,
            duration: "",
            
            formErrors: {description: "", duration: ""},
            fieldState: {description: "is-empty", duration: "is-empty"},
            descriptionValid: false,
            durationValid: false,
            icdCodeValid: false,
            formValid: false,

            minutes: 0
          });
        })
        .catch((error) => {
          if(error.response.data.status > 400 && error.response.data.status < 500){
            UnauthorizedComponent(this.session.user.userName, this.session.patient.patientId)
            this.props.router.push("/atsijungti")
        }else{
            this.setState({
                infoState:(<h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>)
            })
        }
        });
    }else{
      this.setState({
          infoState:<div className="alert alert-danger"><strong>Prašome taisyklingai užpildyti visus laukus ir pasirinkti reikiamą reikšmę iš sąrašo.</strong></div>
      })
    }
  };

  fieldHandler = (e) => {
    // e === event
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    switch (name) {
      case 'icdCode':
          let icdCodeValid = this.state.icdCodeValid;
          icdCodeValid = value === "select" ? false : true;
          this.setState({icdCode: value,
                        icdCodeValid: icdCodeValid}, this.validateForm);   
          break;
      case 'duration':
          let duration = this.state.duration;
          duration = value.replace(/\D/g, "");
          this.setState({duration: duration});   
          break;  
      default:
          this.setState({[name]: value});  
          break;
    }
      
  };

  fieldOnFocusHandler = (e) => {
    // e === event
    const name = e.target.name;

    let fieldValidationState = this.state.fieldState;
  
    switch (name) {
        case 'description':
            fieldValidationState.description = 'is-empty';
            break;
        case 'duration':
            fieldValidationState.duration = 'is-empty';
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
        let nameValid = name + 'Valid';
    
        let fieldValidationErrors = this.state.formErrors;
        switch (name) {
            case 'description':
                fieldValidationErrors.description = '';
                break;
            case 'duration':
                fieldValidationErrors.duration = '';
                break;
            default:
                break;
        }
        this.setState({[nameValid]: false,
            formErrors: fieldValidationErrors
            }, this.validateForm);
    }    
  }

  //Formos laukų validacija:
  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let fieldValidationState = this.state.fieldState;
    let icdCodeValid = this.state.icdCodeValid;
    let descriptionValid = this.state.descriptionValid;
    let durationValid = this.state.durationValid;

    switch (fieldName) {
      case "icdCode":
        if (value.match(/^[a-zA-Z]\d{2}(\.[a-zA-Z0-9]{1,4})?$/g)) {
          icdCodeValid = true;
        } else if (value.match(/^[1-7]{1}$/g)) {
          icdCodeValid = true;
        } else if (value.match(/^[lL]\d{3}$/g)) {
          icdCodeValid = true;
        } else if (value.match(/^[8-9]{1}\d{0,1}(\d-[mM]\d{2})?$/g)) {
          icdCodeValid = true;
        } else {
          icdCodeValid = false;
        }
        // ^ [RAIDĖ][SKAIČIUS][SKAIČIUS](.)(SKAIČIUS*)(SKAIČIUS*)(SKAIČIUS*)(RAIDĖ ARBA SKAIČIUS).
        //*rečiau, raidė, arba X -> jei yra 7-ta pozicija, o kitų pozicijų nėra, šios iki septintosios užpildomos raide X.
        //Specialūs kodai Lietuvoje - [RAIDĖ L][SKAIČIUS][SKAIČIUS][SKAIČIUS]. [SKAIČIUS NUO 1 IKI 7]. [SKAIČIUS 8 ARBA 9](SKAIČIUS)(SKAIČIUS -M SKAIČIUS SKAIČIUS).
        fieldValidationErrors.icdCode = icdCodeValid ? "" : "Įveskite taisyklingą TLK-10 kodą.";
        fieldValidationState.icdCode = icdCodeValid ? 'has-success' : 'has-error';
        break;
      case "description":
        descriptionValid = value.match(/^([\d\w"+-]{1})([\S ]*)$/g);
        // ^ Tikrina ar įrašytas bent simbolis, išskyrus tarpą, tašką, kablelį ir pabraukimą. Toliau jie leidžiami.
        fieldValidationErrors.description = descriptionValid ? "" : "Aprašykite vizitą.";
        fieldValidationState.description = descriptionValid ? 'has-success' : 'has-error';
        break;
      case "duration":
        durationValid = value.match(/^([1-9]{1})([0-9]{0,2})$/g);
        // ^ Tikrina ar įrašytas teigiamas (max. triženklis) skaičius. Negali būti nulis.
        fieldValidationErrors.duration = durationValid ? "" : "Įveskite vizito trukmę.";
        fieldValidationState.duration = durationValid ? 'has-success' : 'has-error';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        fieldState: fieldValidationState,
        //icdCodeValid: icdCodeValid,
        descriptionValid: descriptionValid,
        durationValid: durationValid
      },
      this.validateForm
    );
  };

  //Paspausti "submit" leidžiama tik jei visi laukai įvesti teisingai.
  validateForm = () => {
    this.setState({
      formValid:
        this.state.icdCodeValid &&
        this.state.descriptionValid &&
        this.state.durationValid
    });
  };

  render() {
    return (
      <div className="container">
        <section>
          <UserDetailsComponent fullName={this.session.user.fullName}
              other={<button onClick={() =>  this.props.router.goBack()} className="btn btn-default navbar-text"> Atgal </button>} 
          />

          <PatientInfoCard
            patientFullName={this.state.patient.fullName}
            date={this.state.patient.birthDate}
            patientId={this.state.patient.id}
            slogan={"Ligos įrašo pildymo forma"}
            form={
              <RecordForm
              classNameDescription={this.state.fieldState.description}
              classNameDuration={this.state.fieldState.duration}
              errorMessageDescription={this.state.formErrors.description}
              errorMessageDuration={this.state.formErrors.duration}
              infoState={this.state.infoState}
              formValid={this.state.formValid}
 
              icds={this.state.icds}

              icdCode={this.state.icdCode}
              description={this.state.description}
              isCompensable={this.state.isCompensable}
              isRepetitive={this.state.isRepetitive}
              duration={this.state.duration}
              
              fieldValidationHandler={this.fieldValidationHandler}
              fieldHandler={this.fieldHandler}
              fieldOnFocusHandler={this.fieldOnFocusHandler}
              selectOnFocusHandler={this.selectOnFocusHandler}
              submitHandler={this.submitHandler}

              minutes={this.state.minutes} />
            } />
        </section>
      </div>
    );
  } 
}
