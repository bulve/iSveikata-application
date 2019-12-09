import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import LoginForm from '../LoginForm/LoginForm';
import { userLoggedIn } from './_action/index';
import {doctorApiList, doctorIcdList} from '../Container/_action';

axios.defaults.withCredentials = true;

class UserLoginContainer extends Component {
  constructor(props) {
    super(props);
    this.logoutInfo = JSON.parse(sessionStorage.getItem("401"))
    this.state = {
      userName: "",
      password: "",

      loginCount:0,
      loginTimer:'',

      infoState: "",

      formErrors: { userName: "", password: "" },
      fieldState: { userName: "is-empty", password: "is-empty" },
      userNameValid: false,
      passwordValid: false,
      formValid: false,

      logoutUserName:null,
    };
  }

  componentWillMount = () =>{
    if(this.logoutInfo !== null){
      this.setState({
        userName:this.logoutInfo.userName,
        userNameValid:true,
        infoState:(<div className="alert alert-info">
                      <strong>{this.logoutInfo.info}</strong>
                    </div>)
      })
      sessionStorage.setItem("401", null)
      
    }
  }

  submitHandler = e => {
    e.preventDefault();
    if (this.state.formValid && this.state.loginCount < 3) {
      this.setState({
        loginCount:this.state.loginCount + 1
      })
      let userData = new URLSearchParams();
      userData.append("userName", this.state.userName);
      userData.append("password", this.state.password);
      axios
        .post("http://localhost:8080/api/login", userData, {
          headers: { "Content-type": "application/x-www-form-urlencoded" }
        })
        .then(response => {
          clearTimeout(this.loginTimer)
          this.props.dispatch(
            userLoggedIn(response.data.role, this.state.userName, response.data.fullName)
          );
          this.handleUserRedirect(response.data.role);
        })
        .catch(error => {
          if(error.response.data.status > 400 && error.response.data.status < 500 ){
            this.setState({
                infoState:(<div className="alert alert-danger"><strong> Prisijungti nepavyko. Patikrinkite prisijungimo duomenis ir bandykite dar kartą.</strong></div>)
            })
          }else{
              this.setState({
                  infoState:(<div className="alert alert-danger"><strong> Prisijungti nepavyko dėl serverio klaidos, bandykite dar kartą vėliau.</strong></div>)
              })
          }
        });
    } else {
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
          infoState: (<div className="alert alert-danger">
                <strong>Prašome taisyklingai užpildyti visus laukus.</strong>
              </div>)
        });
      }
    }
    
  };

  handleUserRedirect = (role) => {
    if (role === "admin") {
      this.props.router.push("/administratorius/");
    } else if (role === "doctor") {
      //get API list
      doctorApiList();
      //get ICD list
      doctorIcdList();
      this.props.router.push("/gydytojas/");
    } else if (role === "druggist") {
      this.props.router.push("/vaistininkas/");
    } else {
      this.setState({
        infoState: (
          <div className="alert alert-danger">
            <strong>Tokio vartotojo sistemoje nėra.</strong>
          </div>
        )
      });
    }
  };

  fieldHandler = e => {
    // e === event
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case 'userName':
          let userName = this.state.userName;
          userName = value.replace(/[^a-ząčęėįšųūž\d]/gi, "");
          this.setState({userName: userName});   
          break; 
      default:
          this.setState({[name]: value});  
          break;
    }
  };

  fieldOnFocusHandler = e => {
    // e === event
    const name = e.target.name;

    let fieldValidationState = this.state.fieldState;

    switch (name) {
      case "userName":
        fieldValidationState.userName = "is-empty";
        break;
      case "password":
        fieldValidationState.password = "is-empty";
        break;
      default:
        break;
    }
    this.setState({ fieldState: fieldValidationState, infoState: "", formValid: false});
  };

  fieldValidationHandler = e => {
    // e === event
    const name = e.target.name;
    const value = e.target.value;

    if (value.length !== 0) {
      this.validateField(name, value);
    } else {
      let nameValid = name + "Valid";

      let fieldValidationErrors = this.state.formErrors;
      switch (name) {
        case "userName":
          fieldValidationErrors.userName = "";
          break;
        case "password":
          fieldValidationErrors.password = "";
          break;
        default:
          break;
      }
      this.setState(
        {
          [nameValid]: false,
          formErrors: fieldValidationErrors
        },
        this.validateForm
      );
    }
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let fieldValidationState = this.state.fieldState;

    let userNameValid = this.state.userNameValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "userName":
        userNameValid = value.match(/^[a-ząčęėįšųūž]{6}\d{3}$/gi) || value === "root";
        //userNameValid = value.match(/^(([A-Z]{1})([a-z]{2})){2}(\d{3})$/g) || (value === "root");
        // ^ Tikrina ar įrašytas teisingo formato vartotojo vardas. Sistemoje jis sudaromas iš trijų pirmų vardo raidžių, trijų pirmų pavardės raidžių ir atsitiktinio triženklio skaičiaus.
        //Išimtis: laikinas administratoriaus vartotojo vardas.
        fieldValidationErrors.userName = userNameValid
          ? ""
          : "Patikrinkite ar gerai įvedėte vartotojo vardą.";

        fieldValidationState.userName = userNameValid
          ? "has-success"
          : "has-error";
        //Jei įvesties lauko rėmelis žalias - informacija įvesta teisingai, jei raudonas - neteisingai.
        //Čia "has-success" / "has-error" yra viena iš formos elemento klasių.
        break;
      case "password":
        passwordValid = value.length >= 8 || value === "123";
        // ^ Tikrina ar įrašyta ne mažiau kaip 8 (ir formoje leidžiama įvesti ne daugiau kaip 15 simbolių). Išimtis: laikinas administratoriaus slaptažodis.
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Slaptažodis per trumpas.";
        fieldValidationState.password = passwordValid
          ? "has-success"
          : "has-error";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        fieldState: fieldValidationState,
        userNameValid: userNameValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  };

  //Jei bent vienas laukas neįvestas teisingai, paspaudus "submit" pasirodo perspėjimas.
  validateForm = () => {
    this.setState({
      formValid: this.state.userNameValid && this.state.passwordValid
    });
  };

  render() {
    return (
      <LoginForm
        classNameLoginValue={this.state.fieldState.userName}
        classNamePassword={this.state.fieldState.password}
        errorMessageLoginValue={this.state.formErrors.userName}
        errorMessagePassword={this.state.formErrors.password}
        infoState={this.state.infoState}
        formValid={this.state.formValid}

        loginValue={this.state.userName}
        password={this.state.password}

        fieldValidationHandler={this.fieldValidationHandler}
        fieldHandler={this.fieldHandler}
        fieldOnFocusHandler={this.fieldOnFocusHandler}
        submitHandler={this.submitHandler}
        
        loginPlaceholder={"Vartotojo vardas"}
        loginValueName={"userName"}
      />
    );
  }
}

const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}
  
export default connect(mapStateToProps)(UserLoginContainer);
  
  