import { combineReducers } from 'redux';


import patient from './patientReducer';
import user from './userReducer';
import doctor from './doctorReducer'
import admin from './adminReducer'


const rootReducer = combineReducers({
  user:user,
  patient:patient,
  doctor:doctor,
  admin:admin
});

export default rootReducer;