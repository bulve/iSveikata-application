import React from 'react';
import '../../../Form.css';

export const ChangePasswordForm = (props) =>{
    return(
        <div className="col-sm-12">
            <h2>Slaptažodžio keitimas</h2> 
            <form className="form-horizontal" onSubmit={props.submitHandler}>
                <div className="form-group">        
                    {props.infoState}
                </div>
                <div className={'form-group ' + (props.oldPassword.length === 0 ? 'is-empty' : (props.classNameOldPassword + ' has-feedback'))}>
                    <label className="control-label col-sm-3" htmlFor="oldPassword">Dabartinis slaptažodis:</label>
                    <div className="col-sm-9">
                        <input  type="password" className="form-control" id="oldPassword" name="oldPassword" 
                        value={props.oldPassword} maxLength="15" autoComplete="off"
                        onChange={props.fieldHandler}
                        onFocus={props.fieldOnFocusHandler}
                        onBlur={props.fieldValidationHandler}
                        onContextMenu={props.disableActions}
                        onCopy={props.disableActions}
                        // onPaste={props.disableActions}
                        onCut={props.disableActions} />
                        <span className={props.classNameOldPassword !== 'is-empty' ? (props.classNameOldPassword === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : ''}></span>
                        <span className="help-block">{props.errorMessageOldPassword}</span>
                    </div>
                </div>
                <div className={'form-group ' + (props.newPassword.length === 0 ? 'is-empty' : (props.classNameNewPassword + ' has-feedback'))}>
                    <label className="control-label col-sm-3" htmlFor="newPassword">Naujas slaptažodis:</label>
                    <div className="col-sm-9">
                        <input  type="password" className="form-control" id="newPassword" name="newPassword" 
                        value={props.newPassword}  maxLength="15" autoComplete="off" 
                        onChange={props.fieldHandler}
                        onFocus={props.fieldOnFocusHandler}
                        onBlur={props.fieldValidationHandler}
                        onContextMenu={props.disableActions}
                        onCopy={props.disableActions}
                        onPaste={props.disableActions}
                        onCut={props.disableActions} />
                        <span className={props.classNameNewPassword !== 'is-empty' ? (props.classNameNewPassword === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : ''}></span>
                        <span className="help-block">{props.errorMessageNewPassword}</span>
                    </div>
                </div>
                <div className={'form-group ' + (props.newPasswordRepeat.length === 0 ? 'is-empty' : (props.classNameNewPasswordRepeat + ' has-feedback'))}>
                    <label className="control-label col-sm-3" htmlFor="newPasswordRepeat">Pakartokite naują slaptažodį:</label>
                    <div className="col-sm-9">
                        <input  type="password" className="form-control" id="newPasswordRepeat" name="newPasswordRepeat" 
                        value={props.newPasswordRepeat}  maxLength="15" autoComplete="off"
                        onChange={props.fieldHandler}
                        onFocus={props.fieldOnFocusHandler}
                        onBlur={props.fieldValidationHandler}
                        onContextMenu={props.disableActions}
                        onCopy={props.disableActions}
                        onPaste={props.disableActions}
                        onCut={props.disableActions} />
                        <span className={props.classNameNewPasswordRepeat !== 'is-empty' ? (props.classNameNewPasswordRepeat === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : ''}></span>
                        <span className="help-block">{props.errorMessageNewPasswordRepeat}</span>
                    </div>
                </div>
                <div className="form-group">        
                    <div className="col-sm-offset-3 col-sm-9">
                        <button id="pasFormNSubmit"type="submit" className="btn btn-primary">Pakeisti</button>
                    </div>
                </div>
            </form>
        </div> 
    )
}



              
                   
                      
                                
                          
                       