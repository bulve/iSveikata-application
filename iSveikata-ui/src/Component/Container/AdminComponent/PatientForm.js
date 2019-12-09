import React from 'react';
import '../../../Form.css';

const PatientForm = (props) =>{
    return(                  
        <form className="form-horizontal" onSubmit={props.submitHandler}>
            <div className="form-group">        
                {props.infoState}
            </div>
            <div className={'form-group has-feedback ' + props.classNamePatientId}>   
                <label className="control-label col-sm-3" htmlFor="patientId">Asmens kodas:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="patientId" name="patientId"
                    value={props.patientId} placeholder="Asmens kodas" maxLength="11" autoComplete="off" 
                    onChange={props.fieldHandler}
                    onFocus={props.fieldOnFocusHandler}
                    onBlur={props.fieldValidationHandler} />
                    <span className={props.classNamePatientId !== 'is-empty' ? (props.classNamePatientId === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                    <span className="help-block">{props.errorMessagePatientId}</span>
                </div>
            </div>  
            <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="birthDate">Gimimo data:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="birthDate" name="birthDate" readOnly required
                    value={props.generateBirthDate} placeholder="yyyy-MM-dd" />
                    <span className="help-block"></span>
                </div>
            </div>
            <div className={'form-group has-feedback ' + props.classNameFirstName}>   
                <label className="control-label col-sm-3" htmlFor="firstName">Vardas:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="firstName" name="firstName"
                    value={props.firstName} placeholder="Paciento vardas" maxLength="225"  
                    autoComplete='given-name'
                    onChange={props.fieldHandler}
                    onFocus={props.fieldOnFocusHandler}
                    onBlur={props.fieldValidationHandler} />
                    <span className={props.classNameFirstName !== 'is-empty' ? (props.classNameFirstName === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                    <span className="help-block">{props.errorMessageFirstName}</span>
                </div>
            </div> 
            <div className={'form-group has-feedback ' + props.classNameLastName}>   
                <label className="control-label col-sm-3" htmlFor="lastName">Pavardė:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="lastName" name="lastName"
                    value={props.lastName} placeholder="Paciento pavardė" maxLength="225"
                    autoComplete='family-name'
                    onChange={props.fieldHandler}
                    onFocus={props.fieldOnFocusHandler}
                    onBlur={props.fieldValidationHandler} />
                    <span className={props.classNameLastName !== 'is-empty' ? (props.classNameLastName === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                    <span className="help-block">{props.errorMessageLastName}</span>
                </div>
            </div> 
            <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="password">Slaptažodis:</label>
                <div className="col-sm-9">
                    <input type={props.passwordMasked ? "password" : "text"} className="form-control" id="password" name="password" readOnly required autoComplete="off"
                    value={props.generatePassword} placeholder="Slaptažodis"
                    onClick={props.handlePasswordMasking} />
                    <span className="help-block"></span>
                </div>
            </div>
            <div className="form-group">        
                <div className="col-sm-offset-3 col-sm-9">
                    {props.formValid ? <button type="submit" className="btn btn-success">Registruoti</button> : <button type="submit" className="btn btn-primary">Patvirtinti</button>}
                </div>
            </div>
        </form>
    )  
};

export default PatientForm;
