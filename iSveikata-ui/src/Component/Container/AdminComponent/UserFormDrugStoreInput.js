import React from 'react';
import '../../../Form.css';

export const UserFormDrugStoreInput = (props) =>{
    return (
        <div className="form-group">
            <label className="control-label col-sm-3" htmlFor="companyName">Darbovietės pavadinimas:</label>
            <div className={props.companyType === "select" ? 'is-empty' : 'has-success has-feedback'}>
                <div className="col-sm-2">
                    <select className="form-control" id="companyType" name="companyType" value={props.companyType} onChange={props.fieldHandler} onFocus={props.selectOnFocusHandler}>
                        <option value="select">PASIRINKITE</option>
                        <option value="AB">AB</option>
                        <option value="MB">MB</option>
                        <option value="UAB">UAB</option>
                        <option value="VšĮ">VšĮ</option>
                    </select>
                    <span className={props.companyType === "select" ? 'form-control-feedback' : 'glyphicon glyphicon-ok form-control-feedback'}></span>
                    <span className="help-block"></span>
                </div>
            </div>
            <div className={'has-feedback ' + props.classNameCompanyName}>
                <div className="col-sm-7">  
                    <input type="text" className="form-control" id="companyName" name="companyName" 
                    value={props.companyName} placeholder="Pavadinimas" maxLength="225" autoComplete="organization" 
                    onChange={props.fieldHandler}
                    onFocus={props.fieldOnFocusHandler}
                    onBlur={props.fieldValidationHandler} />
                    <span className={props.classNameCompanyName !== 'is-empty' ? (props.classNameCompanyName === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                    <span className="help-block">{props.errorMessageCompanyName}</span>
                </div>
            </div>
        </div>
    )
}
