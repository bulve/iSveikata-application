import React from 'react'

import '../../../App.css';

export const DetailsModalView = (props) =>{
    return(
        <div id="myModal" className="modal right fade" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">{props.infoHeader}</h4>
                </div>
                <div className="modal-body">
                    {props.infoDetails}
                    {props.prescriptionUsage}
                </div>
                <div className="modal-footer">
                    <button id="closeModalButton" type="button" className="btn btn-default pull-left" data-dismiss="modal">Uždaryti</button>
                </div>
                </div>
            </div>
        </div>
    )
}