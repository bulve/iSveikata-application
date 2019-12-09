import React from 'react';
import icon from '../images/icon.png';
import '../../Frontpage.css';

var AdminNavigation = (props) =>{
    return (
    <nav className="navbar  navbar-inverse navbar-fixed-top" id="mainNav">
        <div className="container">
            <a className="navbar-brand" id="admin" href="#administratorius"><img src={icon} alt="Pagrindinis" id="icon"/></a>
            <ul className="nav navbar-nav navbar-left">
              <li><a className="" id="adminCreatePatient" href="#administratorius/kurti/pacienta">Registruoti naują pacientą</a></li>
              <li><a className="" id="adminCreateUser" href="#administratorius/kurti/vartotoja">Registruoti naują vartotoją</a></li>
              <li><a className="" id="adminBind" href="#administratorius/vartotoju-apjungimas">Priskirti gydytojui pacientą</a></li>
              <li><a className="" href="#administratorius/slaptazodis">Keisti slaptažodį</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
            <li><a className="" id="logout" href="#atsijungti">Atsijungti</a></li>
            </ul>
        </div>
    </nav>
    )
  }
  

  var DoctorNavigation = (props) =>{
    return (
    <nav className="navbar  navbar-inverse navbar-fixed-top" id="mainNav">
      <div className="container">
        <a className="navbar-brand" id="doctorDoctor" href="#gydytojas"><img src={icon} alt="Pagrindinis" id="icon"/></a>
        <ul className="nav navbar-nav navbar-left">
            <li><a className="" id="doctorPatient" href="#gydytojas/pacientai">Pacientai</a></li>
            <li><a className="" id="doctorStatistic" href="#gydytojas/statistika">Darbo dienų statistika</a></li>
            <li><a className="" id="doctorPassword" href="#gydytojas/slaptazodis">Keisti slaptažodį</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
        	<li><a className="" id="logout" href="#atsijungti">Atsijungti</a></li>
        </ul>
      </div>
    </nav>
    )
  }

  
  var DruggistNavigation = (props) =>{
    return (
      <nav className="navbar  navbar-inverse navbar-fixed-top" id="mainNav">
      <div className="container">
        <a className="navbar-brand" id="druggist" href="#vaistininkas"><img src={icon} alt="Pagrindinis" id="icon"/></a>
        <ul className="nav navbar-nav navbar-left">
            <li><a className="" id="druggistPassword" href="#vaistininkas/slaptazodis">Keisti slaptažodį</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
        	<li><a className="" id="logout" href="#atsijungti">Atsijungti</a></li>
        </ul>
      </div>
    </nav>
    )
}
var PatientNavigation = (props) =>{
  return (
    <nav className="navbar  navbar-inverse navbar-fixed-top navbar-expand-lg" id="mainNav">
    
    <div className="container">
      <a className="navbar-brand" id="patient" href="#pacientas"><img src={icon} alt="Pagrindinis" id="icon"/></a>

        <ul className="nav navbar-nav navbar-left">
              <li><a className="" id="patientRecord" href="#pacientas/ligos-irasai"><strong>Mano ligos istorijos įrašai</strong></a></li>
              <li><a className="" id="patientPrescription" href="#pacientas/receptai"><strong>Mano receptai</strong></a></li>
              <li><a className="" id="patientPassword" href="#pacientas/slaptazodis">Keisti slaptažodį</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><a className="" id="logout" href="#atsijungti">Atsijungti</a></li>
        </ul>
      </div>
  </nav>
  )
}


var PublicNavigation = (props) =>{
    return (
      <nav className="navbar  navbar-inverse navbar-fixed-top" id="mainNav">
      <div className="container">
        <a className="navbar-brand" id="homeHome" href="#"><img src={icon} alt="Pagrindinis" id="icon"/></a>
        <ul className="nav navbar-nav">
	        <li><a className="" id="publicStatistic" href="#statistika">Vieša statistika</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
        	<li><a className="" id="loginPatient" href="#pacientams">Prisijungimas pacientams</a></li>
	        <li><a className="" id="loginUsers" href="#vartotojams">Prisijungimas sistemos vartotojams</a></li>
      </ul>
      </div>
    </nav>
    )
}

export {PublicNavigation};
export {AdminNavigation};
export {DoctorNavigation};
export {DruggistNavigation};
export {PatientNavigation}