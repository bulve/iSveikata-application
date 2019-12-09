import React from 'react';

import {AdminNavigation, PublicNavigation, DoctorNavigation, DruggistNavigation, PatientNavigation} from './NavigationComponents';
import { FooterComponent } from './FooterComponent';





var InitialPublicApp = (props) =>{
    return (
    <div>
      <PublicNavigation />
      {props.children}
      <FooterComponent />
    </div>)
  }
  
  var InitialAdminApp = (props) =>{
    return (
    <div>
      <AdminNavigation />
      {props.children}
      <FooterComponent />
    </div>)
  }
  var InitialDoctorApp = (props) =>{
    return (
    <div>
      <DoctorNavigation />
      {props.children}
      <FooterComponent />
    </div>)
  }
  var InitialDruggistApp = (props) =>{
    return (
    <div>
      <DruggistNavigation />
      {props.children}
      <FooterComponent />
    </div>)
  }
  var InitialPatientApp = (props) =>{
    return (
    <div>
      <PatientNavigation />
      {props.children}
      <FooterComponent />
    </div>)
  }
  var NoMatch = () =>{
    return (<div className='container'><section>Puslapis nerastas</section></div>)
  }

export {InitialAdminApp}
export {InitialPublicApp}
export {InitialDoctorApp}
export {InitialDruggistApp}
export {InitialPatientApp}
export {NoMatch}