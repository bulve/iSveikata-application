import React from 'react'
import lr_logo from '../images/lr_logo.png';


export const FooterComponent = () =>{
    return(<footer>
        <div>
            <p className="inline" id="footerLink">
                <a href="http://sam.lrv.lt" id="imgLink"><img src={lr_logo} alt="SAM" id="lrlogo"/></a>
                Lietuvos Respublikos sveikatos apsaugos ministerija
            </p>
            <p className="inline" id="footerText">
                Sprendimas: DTFG, 2018
            </p>    
        </div>
    </footer>)
}