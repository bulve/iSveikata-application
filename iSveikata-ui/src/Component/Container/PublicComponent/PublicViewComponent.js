import React from 'react';

var PublicViewComponent = (props) =>{
    return(
    <div>
        <section>
            <div className="container">           
                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3>Susirgimų ir vaistų vartojimo statistika</h3>
                        </div>
                        <div className="panel-body">
                       
                            <div className="col-sm-6 text-center">
                                <div className="statBtn" disabled={props.icdButtonDisabled} onClick={props.showIcdStatistic}>10 dažniausiai pasitaikančių susirgiimų statistika</div>
                             </div>
                             <div className="col-sm-6 text-center">
                                <div className="statBtn" disabled={props.tlkButtonDisabled} onClick={props.showApiStatistic}>10 dažniausiai perkamų vaistų veikliųjų medžiagų statistika</div>
                            </div>
                       
                            {props.icdStatistic}
                            {props.icdButton}
                            {props.icdTable}
                            
                            {props.apiStatistic}
                            {props.apiButton}
                            {props.apiTable}
                            
                        </div> 
                    </div> 
                </div>           
            </div>
        </section>
    </div>
    )
}

export default PublicViewComponent;