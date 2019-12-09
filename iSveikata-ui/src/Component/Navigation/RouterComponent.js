import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import PublicViewContainer from '../Container/PublicViewContainer';
import PublicStatisticContainer from '../Container/PublicStatisticContainer'

import UserLoginContainer from '../Container/UserLoginContainer'
import PatientLoginContainer from '../Container/PatientLoginContainer'
import AdminCreateUserContainer from '../Container/AdminContainer/AdminCreateUserContainer';
import AdminCreatePatientContainer from '../Container/AdminContainer/AdminCreatePatientContainer'
import AdminBindDoctorPartContainer from '../Container/AdminContainer/AdminBindDoctorPartContainer'
import AdminBindUserPartContainer from '../Container/AdminContainer/AdminBindUserPartContainer'
import AdminViewContainer from '../Container/AdminContainer/AdminViewContainer'

import DoctorViewContainer from '../Container/DoctorContainer/DoctorViewContainer'
import DoctorRecordContainer from '../Container/DoctorContainer/DoctorRecordContainer'
import DoctorPrescriptionContainer from '../Container/DoctorContainer/DoctorPrescriptionContainer'
import DoctorPatientViewContainer from '../Container/DoctorContainer/DoctorPatientViewContainer'
import DoctorPatientListViewContainer from '../Container/DoctorContainer/DoctorPatientListViewContainer'
import DoctorStatisticContainer from '../Container/DoctorContainer/DoctorStatisticContainer'

import DruggistViewContainer from '../Container/DruggistContainer/DruggistViewContainer'
import DruggistPrescriptionViewContainer from '../Container/DruggistContainer/DruggistPrescriptionViewContainer'

import PatientRecordContainer from '../Container/PatientContainer/PatientRecordContainer'
import PatientPrescriptionContainer from '../Container/PatientContainer/PatientPrescriptionContainer'
import PatientPasswordContainer from '../Container/PasswordComponent/PatientPasswordContainer'
import UserPasswordContainer from '../Container/PasswordComponent/UserPasswordContainer'
import {InitialAdminApp, InitialPublicApp, InitialDoctorApp, InitialDruggistApp, InitialPatientApp, NoMatch} from './InitialAppComponents'
import LogoutContainer from '../Container/LogoutContainer';

import GeneruotiIrasus from '../Container/Generators/GeneruotiIrasus'
import PatientViewContainer from '../Container/PatientContainer/PatientViewContainer';



var RouteComponent = () =>{
    return (
      <Router history={hashHistory}  >
          <Route path="/" component={InitialPublicApp} >
            <IndexRoute component={PublicViewContainer} />
            <Route path="/" component={PublicViewContainer} />
            <Route path="/statistika" component={PublicStatisticContainer} />
            <Route path="/pacientams" component={PatientLoginContainer} />
            <Route path="/vartotojams" component={UserLoginContainer} />
            <Route path="/atsijungti" component={LogoutContainer} />
            <Route path="/generuoti" component={GeneruotiIrasus} />
          </Route>

          <Route path="/administratorius" component={InitialAdminApp} >
            <IndexRoute component={AdminViewContainer} />
            <Route path="/administratorius/kurti/vartotoja" component={AdminCreateUserContainer} />
            <Route path="/administratorius/kurti/pacienta" component={AdminCreatePatientContainer} />
            <Route path="/administratorius/vartotoju-apjungimas" component={AdminBindDoctorPartContainer} />
            <Route path="/administratorius/vartotoju-apjungimas/:userName" component={AdminBindUserPartContainer} />
            <Route path="/administratorius/slaptazodis" component={UserPasswordContainer} /> 
            <Route path="*" component={NoMatch}/>
          </Route>

          <Route path="/gydytojas" component={InitialDoctorApp} >
            <IndexRoute component={DoctorViewContainer} />
            <Route path="/gydytojas/pacientai" component={DoctorPatientListViewContainer} />
            <Route path="/gydytojas/statistika" component={DoctorStatisticContainer} />
            <Route path="/gydytojas/naujas/ligos-irasas" component={DoctorRecordContainer} />
            <Route path="/gydytojas/naujas/receptas" component={DoctorPrescriptionContainer} />
            <Route path="/gydytojas/paciento/perziura" component={DoctorPatientViewContainer} />
            <Route path="/gydytojas/slaptazodis" component={UserPasswordContainer} />
            <Route path="*" component={NoMatch}/>
          </Route>

          <Route path="/vaistininkas" component={InitialDruggistApp} >
            <IndexRoute component={DruggistViewContainer} />
            <Route path="/vaistininkas" component={DruggistViewContainer} />
            <Route path="/vaistininkas/klientas/:patientId/receptai" component={DruggistPrescriptionViewContainer} />
            <Route path="/vaistininkas/slaptazodis" component={UserPasswordContainer} />
            <Route path="*" component={NoMatch}/>
          </Route>
          
          <Route path="/pacientas" component={InitialPatientApp} >
            <IndexRoute component={PatientViewContainer} />
            <Route path="/pacientas/ligos-irasai" component={PatientRecordContainer} />
            <Route path="/pacientas/receptai" component={PatientPrescriptionContainer} />
            <Route path="/pacientas/slaptazodis" component={PatientPasswordContainer} />
            <Route path="*" component={NoMatch}/>
          </Route>
      </Router>)
  }

  export default RouteComponent;