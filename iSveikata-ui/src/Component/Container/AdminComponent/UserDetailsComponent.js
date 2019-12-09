import React from 'react'

export const UserDetailsComponent = (props) =>{
    return (
        <div id="userCred" className="navbar navbar-default">
       
        <ul className="nav navbar-nav ">
            <li className="navbar-text">
                <h4>Prisijungęs vartotojas: <strong> {props.fullName}     </strong></h4>
            </li>
        </ul>
        <ul className="nav navbar-nav navbar-right right-navbar">
            {props.other}
        </ul>
        
    </div>
    )
}