import React from 'react';
import '../../../Form.css';

export const UserFormSpecInput = (props) =>{
    return (
        <div>
            <div className={'form-group ' + (props.title === "select" ? 'is-empty' : 'has-success has-feedback')}>
                <label className="control-label col-sm-3" htmlFor="title">Specializacija:</label>
                <div className="col-sm-9">          
                    <select className="form-control" id="title" name="title" autoComplete="specialization-name" 
                    value={props.title} onChange={props.fieldHandler} onFocus={props.selectOnFocusHandler}>
                        <option value="select">PASIRINKITE</option>
                        {props.specializations}
                        <option value="kita">KITA</option>
                    </select>
                    <span className={props.title === "select" ? 'form-control-feedback' : 'glyphicon glyphicon-ok form-control-feedback'}></span>
                    <span className="help-block"></span>
                </div>
            </div>
            {props.otherSpecialization}
        </div>
    )
}





// <div className="form-group">
// <label className="control-label col-sm-3" >Specializacija: </label>
// <div className="col-sm-9">  
// <input name="title" className="form-control" onChange={props.fieldHandler} value={props.title} list="specialization"/>
// </div>
// <datalist id="specialization">
// {props.specialization}
// </datalist>
// </div> 