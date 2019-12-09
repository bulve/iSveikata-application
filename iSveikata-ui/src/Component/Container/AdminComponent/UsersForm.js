import React from 'react';
import '../../../Form.css';

const UsersForm = (props) =>{
    return (        
        <form className="form-horizontal" onSubmit={props.submitHandler}>
            <div className="form-group">
                <div className="radio col-sm-9 col-sm-offset-3">
                    <label><input onChange={props.resetHandler} type="radio" value="doctor" name="type" checked={props.type === 'doctor'} />Gydytojas</label>
                </div>
                <div className="radio col-sm-9 col-sm-offset-3">
                    <label><input onChange={props.resetHandler} type="radio" value="druggist" name="type" checked={props.type === 'druggist'}/>Vaistininkas</label>
                </div>
                <div className="radio col-sm-9 col-sm-offset-3">
                    <label><input onChange={props.resetHandler} type="radio" value="admin" name="type" checked={props.type === 'admin'}/>Administratorius</label>
                </div>
            </div>
            <div className="form-group">        
                {props.infoState}
            </div>
            <div className={'form-group has-feedback ' + props.classNameFirstName}>   
                <label className="control-label col-sm-3" htmlFor="firstName">Vardas:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="firstName" name="firstName"
                    value={props.firstName} placeholder="Vardas" maxLength="225"
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
                    value={props.lastName} placeholder="Pavardė" maxLength="225" 
                    autoComplete='family-name'
                    onChange={props.fieldHandler}
                    onFocus={props.fieldOnFocusHandler}
                    onBlur={props.fieldValidationHandler} />
                    <span className={props.classNameLastName !== 'is-empty' ? (props.classNameLastName === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                    <span className="help-block">{props.errorMessageLastName}</span>
                </div>
            </div> 
            <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="userName">Vartotojo vardas:</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" id="userName" name="userName" readOnly required
                    value={props.userName} placeholder="Vartotojo vardas" />
                    <span className="help-block"></span>
                </div>
            </div>
            <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="password">Slaptažodis:</label>
                <div className="col-sm-9">
                    <input type={props.passwordMasked ? "password" : "text"} className="form-control" id="password" name="password" readOnly required autoComplete="off"
                    value={props.formValid ? props.password : ""} placeholder="Slaptažodis"
                    onClick={props.handlePasswordMasking} />
                    <span className="help-block"></span>
                </div>
            </div>
            {props.specializationInput}
            {props.drugStoreInput}
            <div className="form-group">        
                <div className="col-sm-offset-3 col-sm-9">
                    {props.formValid ? <button type="submit" className="btn btn-success">Registruoti</button> : <button type="submit" className="btn btn-primary">Patvirtinti</button>}
                </div>
            </div>
        </form>
    )  
};

export default UsersForm;





