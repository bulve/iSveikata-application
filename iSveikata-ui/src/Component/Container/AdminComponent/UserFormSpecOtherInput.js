import React from 'react';
import '../../../Form.css';

export const UserFormSpecOtherInput = (props) =>{
    return (
        <div className={'form-group has-feedback ' + props.classNameNewTitle}>   
            <label className="control-label col-sm-3" htmlFor="newTitle">Įrašykite:</label>
            <div className="col-sm-9">
                <input type="text" className="form-control" id="newTitle" name="newTitle"
                value={props.newTitle} placeholder="Specializacija" maxLength="225" autoComplete="specialization" 
                onChange={props.fieldHandler}
                onFocus={props.fieldOnFocusHandler}
                onBlur={props.fieldValidationHandler} />
                <span className={props.classNameNewTitle !== 'is-empty' ? (props.classNameNewTitle === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                <span className="help-block">{props.errorMessageNewTitle}</span>
            </div>
        </div> 
        //name="specializationOther"
    )   
}