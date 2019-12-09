import React from "react";
//import Timer from "../DoctorComponent/Timer";
import "../../../Form.css";

var RecordForm = (props) =>{
    return( 
        <div className="col-sm-12">
            <form className="form-horizontal" onSubmit={props.submitHandler}>
                <div className="form-group">        
                    {props.infoState}
                </div>
                <div className={'form-group ' + (props.icdCode === "select" ? 'is-empty' : 'has-success has-feedback')}>
                    <label className="control-label col-sm-3" htmlFor="icdCode">TLK-10 ligos kodas:</label>
                    <div className="col-sm-9">          
                        <select className="form-control" id="icdCode" name="icdCode" value={props.icdCode} onChange={props.fieldHandler} onFocus={props.selectOnFocusHandler}>
                            <option value="select">PASIRINKITE</option>
                            {props.icds}
                        </select>
                        <span className={props.icdCode === "select" ? 'form-control-feedback' : 'glyphicon glyphicon-ok form-control-feedback'}></span>
                        <span className="help-block"></span>
                    </div>
                </div>
                <div className={'form-group has-feedback ' + props.classNameDescription}>
                    <label className="control-label col-sm-3" htmlFor="description">Vizito aprašymas:</label>
                    <div className="col-sm-9"> 
                        <textarea className="form-control" id="description" name="description"
                        value={props.description} placeholder="Aprašymas" rows="3" maxLength="225" autoComplete="off"
                        onChange={props.fieldHandler}
                        onFocus={props.fieldOnFocusHandler}
                        onBlur={props.fieldValidationHandler}></textarea>
                        <span className={props.classNameDescription !== 'is-empty' ? (props.classNameDescription === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                        <span className="help-block">{props.errorMessageDescription}</span>
                    </div> 
                </div>   
                <div className="form-group">
                    <div className="form-check col-sm-9 col-sm-offset-3">
                        <input type="checkbox" className="form-check-input" id="CheckIfCompensable" name="isCompensable"
                        checked={props.isCompensable} 
                        onChange={props.fieldHandler} />
                        <label className="form-check-label" htmlFor="CheckIfCompensable">
                          Vizitas <strong>kompensuojamas</strong> Valstybinės ligonių kasos.
                        </label>
                    </div>
                    <div className="form-check col-sm-9 col-sm-offset-3">
                        <input type="checkbox" className="form-check-input" id="CheckIfRepetitive" name="isRepetitive"
                        checked={props.isRepetitive} 
                        onChange={props.fieldHandler} />
                        <label className="form-check-label" htmlFor="CheckIfRepetitive">
                          Vizitas <strong>pakartotinis</strong> dėl tos pačios priežasties.
                        </label>
                    </div>
                </div>
                <div className={'form-group has-feedback ' + props.classNameDuration}>   
                    <label className="control-label col-sm-3" htmlFor="duration"> Vizito trukmė (minutėmis):</label>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" id="duration" name="duration"
                        value={props.duration} placeholder="Trukmė" maxLength="3" autoComplete="off" 
                        onChange={props.fieldHandler}
                        onFocus={props.fieldOnFocusHandler}
                        onBlur={props.fieldValidationHandler} />
                        <span className={props.classNameDuration !== 'is-empty' ? (props.classNameDuration === 'has-success' ? 'glyphicon glyphicon-ok form-control-feedback' : 'glyphicon glyphicon-remove form-control-feedback') : 'form-control-feedback'}></span>
                        <span className="help-block">{props.errorMessageDuration}</span>
                    </div>
                    <label className="control-label col-sm-3">Forma atverta {props.minutes === 0 ? " mažiau nei minutę." : props.minutes + " min."} </label>
                    {/* <label className="control-label col-sm-3"><Timer /></label> */}
                </div>   
                <div className="form-group">        
                    <div className="col-sm-offset-3 col-sm-9">
                        {props.formValid ? <button type="submit" className="btn btn-success">Sukurti įrašą</button> : <button type="submit" className="btn btn-default">Patvirtinti</button>}
                    </div>
                </div>
            </form>
        </div> 
    )
};

export default RecordForm;
