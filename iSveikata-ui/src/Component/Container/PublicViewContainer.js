import React, {Component} from 'react';
import {connect} from 'react-redux';

import statistics from '../images/statistics.png';
import system_users from '../images/system_users.png';
import patients from '../images/patients.png';
import logo from '../images/logo.png';
import lr_logo from '../images/lr_logo.png';

import '../../Frontpage.css';


class PublicViewContainer extends Component{



    load = () =>{     }

    render() {
        return (
            <div>
                <header className="text-black">
                    <div className="container">
                        <img  src={logo} alt="iSveikata" id="logo" className="img-responsive center-block"/>
                        {/* <button className="btn btn-success" onClick={this.load}>Load</button> */}
                    </div>
                </header>
                <div>
                    <div className="container">
                        <div className="row frontPagePanel">
                            <div className="col-sm-4">
                                <a href="#pacientams" id="publicPatient" className="thumbnail">
                                <img  src={patients} alt=""/>
                                <h4 className="text-center">Prisijungimas pacientams</h4>
                                </a>
                            </div>
                            <div className="col-sm-4">
                                <a href="#statistika" id="publicStatistic" className="thumbnail">
                                <img  src={statistics} alt=""/>
                                <h4 className="text-center">Vieša statistika</h4>
                                </a>
                            </div>
                            <div className="col-sm-4">
                                <a href="#vartotojams" id="publicUsers" className="thumbnail">
                                <img  src={system_users} alt=""/>
                                <h4 className="text-center">Prisijungimas sistemos vartotojams</h4>
                                </a>
                            </div>    
                        </div>
                        <div className="row">
                            <div className="col-sm-4" id="custom1">
                                <p className="infoText">
                                Prisijungę galite pasiekti visą savo medicininę informaciją.
                                Peržiūrėkite savo ligos istoriją bei išrašytus receptus tada, kada patogu Jums!
                                </p>
                            </div>
                            <div className="col-sm-4" id="custom2">
                                <p className="infoText">
                                Pateikiame susirgimų ir vaistų vartojimo statistiką.
                                </p> 
                                <p className="infoText">
                                Sužinokite kokios ligos ar negalavimai pasitaiko dažniausiai, 
                                bei kokių vaistų, pagal jų veikliąją medžiagą, vartojama daugiausiai.
                                </p>
                            </div>
                            <div className="col-sm-4" id="custom3">
                                <p className="infoText">
                                <strong>Gydytojams. </strong>
                                Registruokite pacientų vizitus, peržiūrėkite ligos istorijas, išrašykite receptus,
                                sekite savo darbo dienų statistiką bei naudokitės kitais sistemos funkcionalumais.
                                </p>
                                <p className="infoText">
                                <strong>Vaistininkams. </strong>
                                Peržiūrėkite galiojančius kliento receptus ir pažymėkite vaisto pirkimo faktą.
                                </p>
                                <p className="infoText">
                                <strong>Administratoriams. </strong>
                                Kurkite paskyras visiems sistemos vartotojams. Priskirkite pacientus gydytojams.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <PublicViewComponent/> */}
                <footer>
                    <div>
                        <p className="inline" id="footerLink">
                            <a href="http://sam.lrv.lt" id="imgLink"><img src={lr_logo} alt="SAM" id="lrlogo"/></a>
                            Lietuvos Respublikos sveikatos apsaugos ministerija
                        </p>
                        <p className="inline" id="footerText">
                            Sprendimas: DTFG, 2018
                        </p>    
                    </div>
                </footer>
            </div>
        )
    }
}


const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}
  
export default connect(mapStateToProps)(PublicViewContainer);
  